import { useQuery } from "@tanstack/react-query";

export default function useGetIndianStates(networkRequest) {

    const query = useQuery({
        queryKey: ["indian_states"],
        queryFn: fetchData,
    });

    async function fetchData() {
        const result = await networkRequest("get_indian_states");
        if (!result.success) throw result;
        return result.data;
    }


    return query;
}
