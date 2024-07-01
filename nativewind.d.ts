import "react-native"
import { Models } from "react-native-appwrite"

declare module "react-native" {
  interface ViewProps {
    className?: string
  }
  interface TextProps {
    className?: string
  }
  interface TabIconProps {
    icon: ImageSourcePropType
    color: string
    name: string
    focused: boolean
  }
  interface ImageProps {
    className?: string
  }
  interface TouchableOpacityProps {
    className?: string
  }
  interface TextInput {
    className?: string
  }
  interface ButtonProps {
    handlePress?: () => void
    containerStyles?: string
    textStyles?: string
    isLoading?: boolean
  }
  interface VideoProps {
    uri: string
  }
  interface FileType {
    fileName: string
    mimeType: string
    fileSize: number
    uri: string
    [extra?: string]: any
  }
  interface FormProps {
    title: string
    value?: string
    video?: VideoProps | null | any
    placeholder?: string
    handleChangeText?: (e: string) => void
    otherStyles?: string
    [extra?: string]: any
  }
  interface SearchInputProps {
    initialQuery?: string
    refetch?: () => void
  }
  interface InfoBoxProps {
    title?: string
    subtitle?: string
    containerStyles?: string
    titleStyles?: string
  }
  interface EmptyStateProps {
    title: string
    subtitle: string
  }
  interface VideoCardProps {
    title: string
    creator: string
    avatar: string
    thumbnail: string
    video: string
  }
  interface TrendingProps {
    posts: Models.Document[]
  }
  interface viewableItemsProps {
    viewableItems: ViewToken<Document>[]
  }
  interface TrendingItemProps {
    item: Models.Document
    activeItem: string
  }
  interface ImageBackgroundProps {
    className?: string
  }
}