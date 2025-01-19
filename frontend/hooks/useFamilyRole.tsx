import { useQuery } from "@tanstack/react-query";
import FamilyService from "@/api/familyService";

const useFamilyRole = (familyId: number) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["family", familyId, "role"],
    queryFn: () => FamilyService.getRole(familyId),
    enabled: !!familyId,
    staleTime: 1000 * 60 * 5,
  });

  return { role: data?.role, isLoadingRole: isPending, refreshRole: refetch };
};

export default useFamilyRole;
