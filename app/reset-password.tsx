import { useLocalSearchParams, useRouter } from 'expo-router';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { CheckCircle2, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { auth } from '../config/firebase';
import { useTheme } from '../utils/Theme';

export default function ResetPassword() {
  const router = useRouter();
  const { oobCode } = useLocalSearchParams<{ oobCode: string }>();
  const { colors } = useTheme();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (oobCode) {
      handleVerifyCode();
    } else {
      setVerifying(false);
      Toast.show({
        type: 'error',
        text1: 'Invalid Link',
        text2: 'Missing or invalid reset code.',
      });
    }
  }, [oobCode]);

  const handleVerifyCode = async () => {
    try {
      const userEmail = await verifyPasswordResetCode(auth, oobCode!);
      setEmail(userEmail);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: 'The reset link is invalid or has expired.',
      });
      router.replace('/(admin-tabs)/Login');
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Required',
        text2: 'Please fill in all fields.',
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password too short',
        text2: 'Password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Mismatch',
        text2: 'Passwords do not match.',
      });
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode!, newPassword);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your password has been reset successfully.',
      });
      router.replace('/(admin-tabs)/Login');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Verifying your request...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          <View style={styles.iconContainer}>
            <ShieldCheck color="#0a66c2" size={48} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>New Password</Text>
          <Text style={styles.subtitle}>
            Please enter a new password for {email || 'your account'}.
          </Text>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Lock color={colors.icon} size={20} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={colors.placeholder}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff color={colors.icon} size={20} />
              ) : (
                <Eye color={colors.icon} size={20} />
              )}
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Lock color={colors.icon} size={20} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleResetPassword}
            disabled={loading}
            activeOpacity={0.8}
          >
            <CheckCircle2 color="#ffffff" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Password'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(10, 102, 194, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    width: '100%',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0a66c2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    width: '100%',
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
