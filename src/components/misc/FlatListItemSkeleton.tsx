import React from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import { SkeletonPulse } from './SkeletonPulse';

export default function FlatListItemSkeleton({ rows = 4, showAvatar = true, style={} }) {
  const widthPatterns: DimensionValue[] = ['85%', '60%', '90%', '45%', '75%', '50%'];

  return (
    <View style={[styles.container, style]}>
      {showAvatar && <SkeletonPulse style={styles.avatar} />}

      <View style={styles.content}>
        {Array.from({ length: rows }).map((_, index) => {
          const dynamicWidth = widthPatterns[index % widthPatterns.length];
          const isLastRow = index === rows - 1;

          return (
            <SkeletonPulse
              key={index}
              style={[
                styles.row,
                { 
                  width: dynamicWidth,
                  marginBottom: isLastRow ? 0 : 8 
                }
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    height: 14,
  },
});