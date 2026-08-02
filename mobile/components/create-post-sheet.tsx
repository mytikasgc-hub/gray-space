import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useTheme, SPACE_COPY, Space } from '../lib/theme-context'
import { useAuth } from '../lib/auth-context'
import { BrandLogo } from './brand-logo'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

interface CreatePostSheetProps {
  isVisible: boolean
  onClose: () => void
  onPostCreated?: () => void
}

export function CreatePostSheet({
  isVisible,
  onClose,
  onPostCreated,
}: CreatePostSheetProps) {
  const { colors, space, setSpace } = useTheme()
  const { session, isGuest } = useAuth()
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      alert('Photo library permission required')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const takePicture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      alert('Camera permission required')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handleCreatePost = async () => {
    if (!content.trim()) {
      alert('Please write something to post')
      return
    }

    try {
      setIsLoading(true)

      if (isGuest || !session?.accessToken) {
        // Shell mode — local success so the create flow is demoable today
        setContent('')
        setSelectedImage(null)
        onClose()
        onPostCreated?.()
        alert(
          space === 'white'
            ? 'Posted to White Space (AI will moderate & correct). Shell demo only.'
            : space === 'grey'
              ? 'Posted to Gray Space (community check may take time). Shell demo only.'
              : 'Posted to Black Space (zero moderation). Shell demo only.'
        )
        return
      }

      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          space,
          image_url: selectedImage || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      setContent('')
      setSelectedImage(null)
      onClose()
      onPostCreated?.()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '90%',
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    spaceSelector: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    spaceTab: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    spaceTabActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    spaceTabText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
      textTransform: 'capitalize',
    },
    spaceTabTextActive: {
      color: '#FFFFFF',
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      minHeight: 100,
      marginBottom: 12,
      color: colors.text,
      fontSize: 16,
      textAlignVertical: 'top',
    },
    imagePreview: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: colors.border,
      position: 'relative',
    },
    removeImageButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 12,
      padding: 8,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    actionButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },
    submitButton: {
      backgroundColor: colors.text,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      opacity: content.trim() ? 1 : 0.5,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.background === '#FFFFFF' ? '#FFFFFF' : '#111111',
    },
  })

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <BrandLogo size={28} />
              <Text style={styles.title}>Create Post</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.spaceSelector}>
              {(['white', 'grey', 'black'] as Space[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.spaceTab,
                    space === s && styles.spaceTabActive,
                  ]}
                  disabled={isLoading}
                  onPress={() => setSpace(s)}
                >
                  <Text
                    style={[
                      styles.spaceTabText,
                      space === s && styles.spaceTabTextActive,
                    ]}
                  >
                    {SPACE_COPY[s].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              editable={!isLoading}
            />

            {selectedImage && (
              <View>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <MaterialIcons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={pickImage}
                disabled={isLoading}
              >
                <MaterialIcons
                  name="image"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.actionButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={takePicture}
                disabled={isLoading}
              >
                <MaterialIcons
                  name="camera-alt"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.actionButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreatePost}
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
