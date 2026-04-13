import * as ImagePicker from 'expo-image-picker';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { Car, Hash, Phone, Save, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { uploadImage } from '../../../config/Cloudinary';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../utils/AuthContext';
import { useTheme } from '../../../utils/Theme';
0;

const VEHICLE_TYPES = ['Auto', 'Car & Travels', 'Richshaw'];

export default function EditDriver() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subCategory, setSubCategory] = useState('');
  const [allSubtypes, setAllSubtypes] = useState<Record<string, string[]>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubtypes = async () => {
      try {
        const snap = await getDocs(collection(db, 'drivers'));
        const mapping: Record<string, Set<string>> = {};
        snap.forEach((d_doc) => {
          const d = d_doc.data();
          if (d.vehicleType && d.subCategory) {
            if (!mapping[d.vehicleType]) mapping[d.vehicleType] = new Set();
            mapping[d.vehicleType].add(d.subCategory);
          }
        });
        const finalMapping: Record<string, string[]> = {};
        for (const key in mapping) {
          finalMapping[key] = Array.from(mapping[key]);
        }
        setAllSubtypes(finalMapping);
      } catch (e) {
        console.error('Error fetching subtypes', e);
      }
    };
    fetchSubtypes();
  }, []);

  useEffect(() => {
    const fetchDriver = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'drivers', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setVehicleType(data.vehicleType || '');
          setSubCategory(data.subCategory || '');
          setVehicleNumber(data.vehicleNumber || '');
          setPhoneNumber(data.phoneNumber || '');
          setImage(data.image || null);
        } else {
          Toast.show({ type: 'error', text1: 'Not Found', text2: 'Driver not found' });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDriver();
  }, [id]);

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

  const handleUpdate = async () => {
    if (name && vehicleType && vehicleNumber && phoneNumber) {
      setSaving(true);
      try {
        let downloadURL = image;
        let cloudId = undefined;

        // If the image is a local URI picked from the gallery, it won't start with http (unless previously saved URL)
        if (image && !image.startsWith('http')) {
          const { secure_url, public_id } = await uploadImage(image);
          downloadURL = secure_url;
          cloudId = public_id;
        }

        const docRef = doc(db, 'drivers', id as string);
        await updateDoc(docRef, {
          name,
          vehicleType,
          vehicleNumber,
          phoneNumber,
          ...(downloadURL && { image: downloadURL, driverImage: downloadURL }),
          ...(cloudId && { cloudPublicId: cloudId }),
          category: vehicleType,
          subCategory: vehicleType.toLowerCase() === 'auto' ? '' : subCategory,
        });

        Toast.show({ type: 'success', text1: 'Success', text2: 'Driver updated successfully.' });
        router.back();
      } catch (error: any) {
        Toast.show({ type: 'error', text1: 'Error updating driver', text2: error.message });
      } finally {
        setSaving(false);
      }
    } else {
      Toast.show({ type: 'error', text1: 'Missing Details', text2: 'Please fill all details.' });
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: colors.background, justifyContent: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary || '#0a66c2'} />
      </SafeAreaView>
    );
  }

  if (!user) return <Redirect href="/(admin-tabs)/Login" />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.content,
            { backgroundColor: colors.card, shadowColor: colors.text },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Edit Driver
          </Text>
          <Text style={styles.subtitle}>Update the driver details below.</Text>

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View
                style={[
                  styles.imagePlaceholder,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <User color={colors.icon} size={32} />
                <Text
                  style={[
                    styles.imagePlaceholderText,
                    { color: colors.placeholder },
                  ]}
                >
                  Upload Image
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Full Name
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <User color={colors.icon} size={20} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Vehicle Type
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Car color={colors.icon} size={20} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. Auto, Van"
                  value={vehicleType}
                  onChangeText={setVehicleType}
                  placeholderTextColor={colors.placeholder}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    color: colors.placeholder,
                    fontSize: 12,
                    alignSelf: 'center',
                    marginRight: 4,
                  }}
                >
                  Suggestions:
                </Text>
                {VEHICLE_TYPES.map((type) => {
                  const isSelected = vehicleType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setVehicleType(type)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: isSelected
                          ? colors.primary || '#0a66c2'
                          : colors.border,
                        backgroundColor: isSelected
                          ? colors.primaryLight || '#e0f2fe'
                          : colors.background,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: isSelected
                            ? colors.primary || '#0a66c2'
                            : colors.text,
                          fontWeight: isSelected ? '600' : '400',
                        }}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {vehicleType !== '' && vehicleType.toLowerCase() !== 'auto' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Vehicle Subtype
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Car color={colors.icon} size={20} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="e.g. Sedan, SUV, Tata Ace"
                    value={subCategory}
                    onChangeText={setSubCategory}
                    placeholderTextColor={colors.placeholder}
                  />
                </View>
                {(allSubtypes[vehicleType] || []).length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.placeholder,
                        fontSize: 12,
                        alignSelf: 'center',
                        marginRight: 4,
                      }}
                    >
                      Previous:
                    </Text>
                    {(allSubtypes[vehicleType] || []).map((subTypeOpt) => {
                      const isSelected = subCategory === subTypeOpt;
                      return (
                        <TouchableOpacity
                          key={subTypeOpt}
                          onPress={() => setSubCategory(subTypeOpt)}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: isSelected
                              ? colors.primary || '#0a66c2'
                              : colors.border,
                            backgroundColor: isSelected
                              ? colors.primaryLight || '#e0f2fe'
                              : colors.background,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              color: isSelected
                                ? colors.primary || '#0a66c2'
                                : colors.text,
                              fontWeight: isSelected ? '600' : '400',
                            }}
                          >
                            {subTypeOpt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Vehicle Number
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Hash color={colors.icon} size={20} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. TN 01 AB 1234"
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                  autoCapitalize="characters"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Phone Number
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Phone color={colors.icon} size={20} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. +91 9876543210"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary || '#0a66c2' },
              ]}
              onPress={handleUpdate}
              activeOpacity={0.8}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Save color="#ffffff" size={20} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Update Driver</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#0a66c2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    marginTop: 12,
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
