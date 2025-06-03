import { RootState } from "@/features/auth/store";
import { useSelector } from "react-redux";

function Workflow() {
    const { tenant } = useSelector((state: RootState) => state.auth);

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 ">
            <iframe src={`https://node.digisense.es?tenantId=${tenant.id}`} className='w-[100%] h-[100%]' />
        </main>
    )
}

export default Workflow