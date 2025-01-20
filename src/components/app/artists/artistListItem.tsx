import Image from "next/image"
import Link from "next/link";
import { cn, formatFollowers } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/contextMenu"
import { Artist } from "@/types/artists"
import { useTranslations } from "next-intl";
import { FiExternalLink, FiHeart } from "react-icons/fi";
import { AiOutlineSpotify } from "react-icons/ai";
import { LuHeartOff } from "react-icons/lu";
import useFollowArtist from "@/hooks/followArtist";
import { PaginationProps } from "@/types/ui/pagination";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  artist: Artist,
  token: string,
  listType: 'followed' | 'top_last_month' | 'top_six_months' | 'top_all_time',
  pagination: PaginationProps,
  index: number,
  aspectRatio?: "portrait" | "square",
  width?: number,
  height?: number,
  isLink?: boolean,
}

export function ArtistListItem({
  artist,
  token,
  index,
  listType,
  pagination,
  aspectRatio = "portrait",
  width,
  height,
  isLink = false,
  className,
  ...props
}: AlbumArtworkProps) {
  const t = useTranslations('app.artist');
  const isFollowed = artist.followed || false;

  const { handleFollowClick } = useFollowArtist({
    artist,
    listType,
    isFollowed,
    pagination,
    token: token,
  });


  const cardContent = (
    <div className={cn("space-y-3 cursor-pointer", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <Image
              src={artist.images[0].url}
              alt={artist.name}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={(e) => {e.stopPropagation(); handleFollowClick()}}>
            <div className="flex justify-start items-center gap-2">
              {isFollowed ? <LuHeartOff className="w-3.5 h-3.5"/> : <FiHeart className="w-3.5 h-3.5"/> }
              {isFollowed ? t('unfollow') : t('follow')}
            </div>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Link href={artist.uri} className="whitespace-nowrap flex justify-start items-center gap-2">
              <AiOutlineSpotify className="w-3.5 h-3.5"/>
              {t('show')}
            </Link>
          </ContextMenuItem>
          <ContextMenuItem>
            <Link href={artist.external_urls.spotify} target="_blank" className="whitespace-nowrap flex justify-start items-center gap-2">
              <FiExternalLink className="w-3.5 h-3.5"/>
              {t('showWeb')}
            </Link>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{index + 1}. {artist.name}</h3>
        <p className="text-xs text-muted-foreground">{formatFollowers(artist.followers.total)} {t('followers')}</p>
      </div>
    </div>
  );

  return isLink ? (
    <Link href={`/artist/${artist.id}`}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}