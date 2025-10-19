import { View, Text } from 'react-native'
import React from 'react'
import { MiniProduct } from '../storage-helper/recentlyViewed'

interface RecentlyViewedProps {
    items: MiniProduct[];
    onPressItem: (item: MiniProduct) => void;
}

const RecentlyViewed = ({items, onPressItem}:RecentlyViewedProps) => {
  return (
    <View>
      <Text>SON GÖRÜNTÜLENEN ÜRÜNLER</Text>
    </View>
  )
}

export default RecentlyViewed