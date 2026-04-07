// Authentication Service for Mela
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

/**
 * Sign up with email and password
 */
export const signUp = async (email, password, displayName, university) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL || '',
      university: university,
      role: 'student',
      moderatorFor: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists, create if not
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create new user profile
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        university: '',
        role: 'student',
        moderatorFor: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out current user
 */
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Get current user profile from Firestore
 */
export const getCurrentUserProfile = async () => {
  const user = getCurrentUser();
  if (!user) return null;

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
