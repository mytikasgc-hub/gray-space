import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Header } from '../../components/header'
import { useTheme } from '../../lib/theme-context'
import { MOCK_POSTS } from '../../lib/mock-data'

export default function SearchScreen() {
  const { colors } = useTheme()
  const [query, setQuery] = useState('')

  const people = useMemo(() => {
    const map = new Map<string, (typeof MOCK_POSTS)[0]['profiles']>()
    MOCK_POSTS.forEach((p) => map.set(p.profiles.id, p.profiles))
    return Array.from(map.values())
  }, [])

  const filteredPeople = people.filter((p) =>
    p.username.toLowerCase().includes(query.trim().toLowerCase())
  )

  const filteredPosts = MOCK_POSTS.filter(
    (p) =>
      p.content.toLowerCase().includes(query.trim().toLowerCase()) ||
      p.profiles.username.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="GRAY SPACE" showSearch={false} showProfile />

      <View style={styles.titleRow}>
        <Text style={[styles.heading, { color: colors.text }]}>Search</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          People and posts across every space
        </Text>
      </View>

      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <MaterialIcons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Gray Space"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <MaterialIcons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={[
          { type: 'header', id: 'people', title: 'People' },
          ...filteredPeople.map((p) => ({ type: 'person' as const, id: p.id, person: p })),
          { type: 'header', id: 'posts', title: 'Posts' },
          ...filteredPosts.map((p) => ({ type: 'post' as const, id: p.id, post: p })),
        ]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <Text style={[styles.section, { color: colors.textSecondary }]}>
                {(item as any).title}
              </Text>
            )
          }
          if (item.type === 'person') {
            const person = (item as any).person
            return (
              <View
                style={[
                  styles.row,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {person.avatar_url ? (
                  <Image source={{ uri: person.avatar_url }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: colors.border }]} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: colors.text }]}>
                    {person.username}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {person.verification_level === 'verified'
                      ? 'Verified in White Space'
                      : 'Member'}
                  </Text>
                </View>
              </View>
            )
          }
          const post = (item as any).post
          return (
            <View
              style={[
                styles.row,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: colors.text }]}>
                  @{post.profiles.username}
                </Text>
                <Text
                  style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}
                  numberOfLines={2}
                >
                  {post.content}
                </Text>
              </View>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 11,
                  textTransform: 'uppercase',
                }}
              >
                {post.space === 'grey' ? 'gray' : post.space}
              </Text>
            </View>
          )
        }}
        ListFooterComponent={<View style={{ height: 110 }} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 13,
    marginTop: 4,
  },
  searchBox: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  list: {
    paddingHorizontal: 12,
  },
  section: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
})
