import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { Redirect } from 'expo-router';
import { Camera, Mail, Phone, Save, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../utils/AuthContext';
import { useTheme } from '../../utils/Theme';

export default function AdminProfile() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved profile data from local storage
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('adminProfile');
        if (storedProfile) {
          const { name: storedName, phone: storedPhone, image: storedImage } = JSON.parse(storedProfile);
          if (storedName) setName(storedName);
          if (storedPhone) setPhone(storedPhone);
          if (storedImage) setImage(storedImage);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('adminProfile', JSON.stringify({ name, phone, image }));
      Toast.show({
        type: 'success',
        text1: 'Profile Saved',
        text2: 'Your admin profile has been updated.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Could not save profile details.',
      });
    } finally {
      setSaving(false);
    }
  };

  const openEmail = () => {
    Linking.openURL('mailto:skiruthik2510@gmail.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:8072682003');
  };

  if (!user) return <Redirect href="/(admin-tabs)/Login" />;

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Admin Profile</Text>
        </View>

        {/* Profile Editing Section */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage} activeOpacity={0.8}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <User color={colors.icon} size={40} />
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Camera color="#ffffff" size={16} />
              </View>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Admin Name</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <User color={colors.icon} size={20} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Phone color={colors.icon} size={20} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Save color="#ffffff" size={20} style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info / Developer Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Info</Text>
          <View style={[styles.card, { backgroundColor: colors.card, padding: 20 }]}>
            <View style={styles.devHeader}>
              <View style={styles.devIconBox}>
                <User color="#0a66c2" size={24} />
              </View>
              <View>
                <Text style={styles.devRole}>Developed by</Text>
                <Text style={[styles.devName, { color: colors.text }]}>SARAN KIRUTHIK S S</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.contactRow} onPress={openEmail}>
              <View style={[styles.contactIconBg, { backgroundColor: '#fef2f2' }]}>
                <Mail color="#ef4444" size={20} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Email Address</Text>
                <Text style={[styles.contactValue, { color: colors.text }]}>skiruthik2510@gmail.com</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactRow} onPress={openPhone}>
              <View style={[styles.contactIconBg, { backgroundColor: '#f0fdf4' }]}>
                <Phone color="#16a34a" size={20} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Phone Number</Text>
                <Text style={[styles.contactValue, { color: colors.text }]}>8072682003</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0a66c2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0a66c2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  devHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  devIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  devRole: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  devName: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '500',
  },
});
