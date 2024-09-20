import { fetchUsers } from "@/lib/actions/user.actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const Page = async () => {

    const users = await fetchUsers();
    return (
        <section className="w-full px-10 py-20 h-screen max-md:pb-36 max-[360px]:px-4"> 
            <h1 className="w-full text-heading1-bold drop-shadow-text-blue">Клієнти</h1>
            <DataTable columns={columns} data={users}/>
        </section>
    )
}

export default Page;