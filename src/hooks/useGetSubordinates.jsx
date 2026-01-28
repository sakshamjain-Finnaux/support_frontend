import { useQuery } from "@tanstack/react-query";

export default function useGetSubOrdinates(networkRequest, enabled = true) {
  const query = useQuery({
    queryKey: ["user", "subordinates"],
    queryFn: fetchData,
    staleTime: 0,
    enabled,
  });

  async function fetchData() {
    const result = await networkRequest("get_user_subordinates");
    if (!result.success) throw result;
    return result.data;
  }

  return query;
}
