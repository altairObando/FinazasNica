import { Category } from '@/interfaces/Categories/Category';
import { toTransparentColor } from '@/lib/format';
import React from 'react';
import { StyleSheet } from 'react-native';
import { List, useTheme } from 'react-native-paper';

type CategoryListItemProps = {
    category: Category;
    onPress: (id: number) => void;
}

const CategoryListItemComponent: React.FC<CategoryListItemProps> = ({ category, onPress }) => {
    const theme = useTheme();

    return (
        <List.Item
            onPress={() => onPress(category.id)}
            left={props => (
                <List.Icon
                    icon={category.icon}
                    color={category?.color ?? props.color}
                    style={[
                        props.style,
                        styles.leftIcon,
                        { backgroundColor: toTransparentColor(category.color) }
                    ]}
                />
            )}
            title={category.name}
            description={category.description}
            right={props => (
                <List.Icon
                    icon='chevron-right'
                    style={[props.style, styles.leftIcon]}
                    color={theme.colors.primary} />
            )}
        />
    );
};

export const CategoryListItem = React.memo(CategoryListItemComponent);

const styles = StyleSheet.create({
    leftIcon: {
        borderRadius: 15,
        padding: 10,
    },
});
