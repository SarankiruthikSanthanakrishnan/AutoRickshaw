import { Redirect, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, LogIn, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../../config/firebase';
import { useAuth } from '../../utils/AuthContext';
import { useTheme } from '../../utils/Theme';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme();
  const { user, signIn, loading } = useAuth();

  if (loading) return null;
  if (user) return <Redirect href="/(admin-tabs)" />;

  const handleLogin = async () => {
    if (email && password) {
      try {
        const creds = await signInWithEmailAndPassword(auth, email, password);
        await signIn(creds.user.uid);
        router.replace('/(admin-tabs)' as any);
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.content, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Admin Portal
            </Text>
            <Text style={styles.subtitle}>
              Sign in to manage drivers and bookings.
            </Text>
          </View>

          <View style={styles.form}>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <Mail color={colors.icon} size={20} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.placeholder}
              />
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
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <LogIn color="#ffffff" size={20} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
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
    marginTop: 8,
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
