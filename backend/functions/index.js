// Firebase Cloud Functions for Mela Event Platform
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a user is a moderator for a specific university
 */
async function isModeratorFor(uid, university) {
  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return false;
    
    const userData = userDoc.data();
    return userData.role === "moderator" && 
           userData.moderatorFor && 
           userData.moderatorFor.includes(university);
  } catch (error) {
    console.error("Error checking moderator status:", error);
    return false;
  }
}

/**
 * Verify user authentication
 */
function requireAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to perform this action."
    );
  }
  return context.auth.uid;
}

// ============================================================================
// EVENT APPROVAL FUNCTION
// ============================================================================

/**
 * Approve an event submission
 * Moves submission from 'submissions' to 'events' collection
 */
exports.approveEvent = functions.https.onCall(async (data, context) => {
  const uid = requireAuth(context);
  const { submissionId } = data;

  if (!submissionId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Submission ID is required."
    );
  }

  try {
    // Get the submission document
    const submissionRef = db.collection("submissions").doc(submissionId);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Submission not found."
      );
    }

    const submissionData = submissionDoc.data();

    // Verify moderator status for the submission's university
    const isMod = await isModeratorFor(uid, submissionData.university);
    if (!isMod) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You are not authorized to approve events for this university."
      );
    }

    // Create the approved event
    const eventData = {
      ...submissionData,
      approved: true,
      approvedBy: uid,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Remove status field (only for submissions)
    delete eventData.status;
    delete eventData.rejectionReason;
    delete eventData.rejectedBy;

    // Add to events collection and delete from submissions
    await db.collection("events").add(eventData);
    await submissionRef.delete();

    return {
      success: true,
      message: "Event approved successfully."
    };
  } catch (error) {
    console.error("Error approving event:", error);
    
    // Re-throw HttpsErrors
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      "internal",
      "Failed to approve event."
    );
  }
});

// ============================================================================
// EVENT REJECTION FUNCTION
// ============================================================================

/**
 * Reject an event submission
 * Updates status and adds rejection reason
 */
exports.rejectEvent = functions.https.onCall(async (data, context) => {
  const uid = requireAuth(context);
  const { submissionId, reason } = data;

  if (!submissionId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Submission ID is required."
    );
  }

  try {
    // Get the submission document
    const submissionRef = db.collection("submissions").doc(submissionId);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Submission not found."
      );
    }

    const submissionData = submissionDoc.data();

    // Verify moderator status
    const isMod = await isModeratorFor(uid, submissionData.university);
    if (!isMod) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You are not authorized to reject events for this university."
      );
    }

    // Update submission with rejection info
    await submissionRef.update({
      status: "rejected",
      rejectionReason: reason || "No reason provided",
      rejectedBy: uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: "Event rejected successfully."
    };
  } catch (error) {
    console.error("Error rejecting event:", error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      "internal",
      "Failed to reject event."
    );
  }
});

// ============================================================================
// MODERATOR VERIFICATION FUNCTION
// ============================================================================

/**
 * Check if current user is a moderator
 * Returns moderator status and universities
 */
exports.checkModeratorStatus = functions.https.onCall(async (data, context) => {
  const uid = requireAuth(context);

  try {
    const userDoc = await db.collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      return {
        isModerator: false,
        universities: []
      };
    }

    const userData = userDoc.data();
    
    return {
      isModerator: userData.role === "moderator",
      universities: userData.moderatorFor || [],
      university: userData.university
    };
  } catch (error) {
    console.error("Error checking moderator status:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to check moderator status."
    );
  }
});

// ============================================================================
// USER PROFILE CREATION TRIGGER
// ============================================================================

/**
 * Automatically create user profile when a new user signs up
 */
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  try {
    const userProfile = {
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      university: "",
      role: "student",
      moderatorFor: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("users").doc(user.uid).set(userProfile);
    console.log(`User profile created for ${user.uid}`);
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
});

// ============================================================================
// EVENT REMINDER SCHEDULER (Future Feature)
// ============================================================================

/**
 * Scheduled function to send reminders for upcoming events
 * Runs every hour
 */
exports.sendEventReminders = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async () => {
    try {
      const now = admin.firestore.Timestamp.now();
      const tomorrow = new Date(now.toDate());
      tomorrow.setHours(tomorrow.getHours() + 24);

      // Find saved events happening in the next 24 hours
      const savedEventsSnapshot = await db.collection("savedEvents")
        .where("reminderSent", "==", false)
        .where("eventDateTime", ">", now)
        .where("eventDateTime", "<", admin.firestore.Timestamp.fromDate(tomorrow))
        .get();

      console.log(`Found ${savedEventsSnapshot.size} events needing reminders`);

      // Mark reminders as sent
      const batch = db.batch();
      savedEventsSnapshot.forEach((doc) => {
        batch.update(doc.ref, { reminderSent: true });
      });
      await batch.commit();

      // TODO: Implement actual notification system (email/push)
      // This is a placeholder for future implementation

      return null;
    } catch (error) {
      console.error("Error sending event reminders:", error);
      return null;
    }
  });

// ============================================================================
// CLEANUP REJECTED SUBMISSIONS (Optional)
// ============================================================================

/**
 * Delete rejected submissions after 30 days
 * Runs daily
 */
exports.cleanupRejectedSubmissions = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const snapshot = await db.collection("submissions")
        .where("status", "==", "rejected")
        .where("updatedAt", "<", admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .get();

      console.log(`Cleaning up ${snapshot.size} old rejected submissions`);

      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      return null;
    } catch (error) {
      console.error("Error cleaning up rejected submissions:", error);
      return null;
    }
  });

