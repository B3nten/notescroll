import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { queryBuilder as qb } from '@/common/functions/queryBuilder'
export default function Test() {
	const query = useSupabaseQuery(...qb.notes.single('a', 'b')) 

	return <div></div>
}
