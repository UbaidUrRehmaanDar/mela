// Organizer Application Service for Mela (Supabase)
import { supabase, STORAGE_BUCKET } from '../config/supabase';
import { getAuthUser } from './authService';
import { adminUpdateUserProfile } from './userService';

function mapApplication(app) {
  if (!app) return null;
  return {
    ...app,
    displayName: app.display_name || '',
    societyName: app.society_name || '',
    idCardURL: app.id_card_url || '',
    societyProofURL: app.society_proof_url || '',
    authorizationURL: app.authorization_url || '',
    userId: app.user_id || '',
    userEmail: app.user_email || '',
    createdAt: app.created_at || null,
    updatedAt: app.updated_at || null,
  };
}

/**
 * Upload a verification document to Supabase Storage
 */
export const uploadApplicationDocument = async (userId, file, docType) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const filePath = `organizer-documents/${userId}/${docType}_${Date.now()}.${fileExtension}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error(`Error uploading ${docType}:`, error);
    throw error;
  }
};

/**
 * Submit a new organizer application
 */
export const submitOrganizerApplication = async (applicationData, files) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to apply' };
    }

    const existing = await getUserApplication(user.id);
    if (existing.success && existing.application && existing.application.status === 'pending') {
      return { success: false, error: 'You already have a pending application.' };
    }

    const appData = {
      user_id: user.id,
      user_email: user.email,
      display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      university: applicationData.university,
      society_name: applicationData.societyName || '',
      reason: applicationData.reason,
      status: 'pending',
      feedback: '',
      id_card_url: '',
      society_proof_url: '',
      authorization_url: '',
    };

    const { data: inserted, error } = await supabase
      .from('organizer_applications')
      .insert(appData)
      .select()
      .single();

    if (error) throw error;

    const applicationId = inserted.id;
    const uploadedUrls = {};

    if (files.idCard) {
      uploadedUrls.id_card_url = await uploadApplicationDocument(user.id, files.idCard, 'id_card');
    }
    if (files.societyProof) {
      uploadedUrls.society_proof_url = await uploadApplicationDocument(user.id, files.societyProof, 'society_proof');
    }
    if (files.authorization) {
      uploadedUrls.authorization_url = await uploadApplicationDocument(user.id, files.authorization, 'authorization');
    }

    if (Object.keys(uploadedUrls).length > 0) {
      await supabase
        .from('organizer_applications')
        .update(uploadedUrls)
        .eq('id', applicationId);
    }

    return {
      success: true,
      applicationId,
      message: 'Organizer application submitted successfully',
    };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get the application status/data for a specific user
 */
export const getUserApplication = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('organizer_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      return { success: true, application: null };
    }

    return { success: true, application: mapApplication(data[0]) };
  } catch (error) {
    console.error('Error getting user application:', error);
    return { success: false, error: error.message, application: null };
  }
};

/**
 * Fetch all organizer applications (Admin review)
 */
export const getAllOrganizerApplications = async () => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', applications: [] };
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userProfile || userProfile.role !== 'admin') {
      return { success: false, error: 'Unauthorized', applications: [] };
    }

    const { data, error } = await supabase
      .from('organizer_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const applications = (data || []).map(mapApplication);

    return { success: true, applications };
  } catch (error) {
    console.error('Error fetching applications:', error);
    return { success: false, error: error.message, applications: [] };
  }
};

/**
 * Admin action: Approve or Reject organizer application
 */
export const reviewOrganizerApplication = async (applicationId, userId, action, feedback, university) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userProfile || userProfile.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admins only.' };
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const { error: updateError } = await supabase
      .from('organizer_applications')
      .update({
        status: newStatus,
        feedback: feedback || '',
      })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    if (action === 'approve') {
      const { data: targetUser } = await supabase
        .from('users')
        .select('moderator_for')
        .eq('id', userId)
        .single();

      let currentModeratorFor = targetUser?.moderator_for || [];

      if (!currentModeratorFor.includes(university)) {
        currentModeratorFor.push(university);
      }

      await adminUpdateUserProfile(userId, {
        role: 'moderator',
        moderatorFor: currentModeratorFor,
      });
    }

    return { success: true, message: `Application ${newStatus} successfully` };
  } catch (error) {
    console.error('Error reviewing application:', error);
    return { success: false, error: error.message };
  }
};
