// dynamic routing 

import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useAppwrite from '@/lib/useAppwrite'
import { searchPosts } from '@/lib/appwrite'
import { SafeAreaView } from 'react-native-safe-area-context'
import VideoCard from '@/components/VideoCard'
import { SearchInput } from '@/components'
import EmptyState from '@/components/EmptyState'

const Search = () => {
  const { query } = useLocalSearchParams()
  const squery = query as string
  const { data: posts, refetch } = useAppwrite(() => searchPosts(squery))

  useEffect(() => {
    refetch()
  }, [squery])


  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={squery} refetch={refetch} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search