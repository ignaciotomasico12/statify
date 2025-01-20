import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner"
import { TopArtists, Artists, Artist } from "@/types/artists";
import { followArtist as followArtistService, unfollowArtist as unfollowArtistService } from "@/services/artists";
import { PaginationProps } from '@/types/ui/pagination';

type UseFollowArtistProps = {
  artist: { id: string; name: string; isFollowedArtist?: boolean };
  isFollowed: boolean;
  token: string;
  pagination?: PaginationProps;
  listType?: 'followed' | 'top_last_month' | 'top_six_months' | 'top_all_time';
};

const useFollowArtist = ({ artist, isFollowed, token, listType, pagination }: UseFollowArtistProps) => {
  const queryClient = useQueryClient();

  const handleFollowMutation = useMutation({
    mutationFn: ({ id, follow }: { id: string, follow: boolean }) => {
        return follow ? followArtistService(token, [id]) : unfollowArtistService(token, [id]);
    },
    onSuccess: (_, { follow }) => {
        toast.success(follow ? `Empezaste a seguir a ${artist.name}.` : `Dejaste de seguir a ${artist.name}.`, { duration: 2000 });
    },
    onError: (error) => {
        toast.error(`Error: ${error}`, { duration: 2000 });
    },
    onMutate: async ({ follow }) => {
        if(listType && pagination){
            const previousArtistsListData: Artists | TopArtists | undefined = queryClient.getQueryData([`${listType}_artists`, listType, pagination]);
            if (previousArtistsListData) {
                queryClient.setQueryData([`${listType}_artists`, listType, pagination], {
                    ...previousArtistsListData,
                    items: previousArtistsListData as Artists && previousArtistsListData.items.map((artist: Artist) => {
                        if (artist.id === artist.id) {
                            return {...artist, followed: follow};
                        }
                        return artist;
                    }),
                });
            }
        } else {
            const previousArtistData = queryClient.getQueryData([`artist_${artist.id}`, artist.id]);
            if (typeof previousArtistData === 'object' && previousArtistData !== null) {
                queryClient.setQueryData([`artist_${artist.id}`, artist.id], {...previousArtistData, isFollowedArtist: [follow]});
            }
            return { previousArtistData };
        }
    },
  });

  const handleFollowClick = () => {
    handleFollowMutation.mutate({ id: artist.id, follow: !isFollowed });
  };

  return {
    handleFollowClick,
  };
};

export default useFollowArtist;