"use client";

import Image from "next/image"
import Link from "next/link";
import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/contextMenu"
import { Playlist } from "@/types/playlits"
import { useTranslations } from "next-intl";
import { FiExternalLink } from "react-icons/fi";
import { AiOutlineSpotify } from "react-icons/ai";

interface PlaylistListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  playlist: Playlist,
  index: number,
  aspectRatio?: "portrait" | "square",
  width?: number,
  height?: number,
}

export function PlaylistListItem({
  playlist,
  index,
  aspectRatio = "square",
  width,
  height,
  className,
  ...props
}: PlaylistListItemProps) {
  const t = useTranslations('app.playlists');

  const cardContent = (
    <div className={cn("space-y-3 cursor-pointer group", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className={cn(
            "overflow-hidden rounded-md shadow-md bg-slate-200 dark:bg-dark-light relative w-full",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}>
            <Image
              src={playlist.images[0]?.url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop"}
              alt={playlist.name}
              fill
              className="object-cover transition-all group-hover:scale-105"
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem>
            <Link href={playlist.uri} className="whitespace-nowrap flex justify-start items-center gap-2">
              <AiOutlineSpotify className="w-3.5 h-3.5"/>
              {t('show')}
            </Link>
          </ContextMenuItem>
          <ContextMenuItem>
            <Link href={playlist.external_urls.spotify} target="_blank" className="whitespace-nowrap flex justify-start items-center gap-2">
              <FiExternalLink className="w-3.5 h-3.5"/>
              {t('showWeb')}
            </Link>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-semibold leading-none truncate group-hover:text-primary transition-colors">
            {index + 1}. {playlist.name}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
            {playlist.tracks.total} {t('tracks')}
        </p>
      </div>
    </div>
  );

  return (
    <Link href={playlist.external_urls.spotify} target="_blank">
      {cardContent}
    </Link>
  );
}
