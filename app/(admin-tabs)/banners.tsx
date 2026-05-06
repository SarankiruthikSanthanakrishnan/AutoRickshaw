import * as ImagePicker from 'expo-image-picker';
import { Redirect } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Image as ImageIcon, Trash2, Upload } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { db, storage } from '../../config/firebase';
import { BannerData } from '../../types';
import { useAuth } from '../../utils/AuthContext';
import LoadingAnimation from '../../utils/LoadingAnimation';
import { useTheme } from '../../utils/Theme';

export default function ManageBanners() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const bannerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BannerData[];
      // Sort by creation time descending
      bannerData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setBanners(bannerData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const pickAndUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9], // Banners are typically wide
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setUploading(true);
      try {
        const imageUri = result.assets[0].uri;
        
        // Convert to blob for Firebase Storage
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        // Generate a unique file name
        const filename = `banners/banner_${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);
        
        // Upload to Firebase Storage
        await uploadBytes(storageRef, blob);
        
        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef);
        
        // Save to Firestore
        await addDoc(collection(db, 'banners'), {
          imageUrl: downloadUrl,
          storagePath: filename,
          createdAt: Date.now(),
        });
        
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Banner uploaded successfully!',
        });
      } catch (error: any) {
        console.error('Error uploading banner:', error);
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: error.message || 'An error occurred during upload',
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = (item: BannerData) => {
    Alert.alert('Delete Banner', 'Are you sure you want to delete this banner?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Try to delete from Firebase Storage
            if (item.storagePath) {
              const storageRef = ref(storage, item.storagePath);
              await deleteObject(storageRef).catch(e => console.log('Storage deletion error (maybe already deleted):', e));
            }
            
            // Delete from Firestore
            await deleteDoc(doc(db, 'banners', item.id));
            
            Toast.show({
              type: 'success',
              text1: 'Deleted',
              text2: 'Banner has been removed',
            });
          } catch (error: any) {
            Toast.show({
              type: 'error',
              text1: 'Delete Failed',
              text2: error.message,
            });
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: BannerData }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Trash2 color="#ef4444" size={20} />
      </TouchableOpacity>
    </View>
  );

  if (!user) return <Redirect href="/(admin-tabs)/Login" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Banners</Text>
      </View>

      <View style={styles.uploadSection}>
        <TouchableOpacity
          style={[styles.uploadButton, uploading && { opacity: 0.7 }]}
          onPress={pickAndUploadImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Upload color="#ffffff" size={20} style={styles.uploadIcon} />
              <Text style={styles.uploadText}>Upload New Banner</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.uploadHint}>Recommended aspect ratio: 16:9</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <LoadingAnimation />
        </View>
      ) : (
        <FlatList
          data={banners}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ImageIcon color={colors.placeholder} size={48} />
              <Text style={[styles.emptyText, { color: colors.placeholder }]}>
                No banners found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
                Upload a banner to display it on the home screen
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  uploadSection: {
    padding: 24,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#0a66c2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#0a66c2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  listContainer: {
    padding: 24,
    paddingTop: 0,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
