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
    <div className={cn("space-y-3 cursor-pointer group", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className={cn(
            "overflow-hidden rounded-md relative w-full shadow-md bg-slate-200 dark:bg-dark-light",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}>
            <Image
              src={artist.images[0]?.url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop"}
              alt={artist.name}
              fill
              className="object-cover transition-all group-hover:scale-105"
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
        <h3 className="font-semibold leading-none truncate group-hover:text-primary transition-colors">
            {index + 1}. {artist.name}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
            {formatFollowers(artist.followers.total)} {t('followers')}
        </p>
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