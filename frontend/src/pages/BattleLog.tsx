import SearchInput from "../components/SearchInput";

const BattleLog = () => {
    return (
        <>
            <SearchInput />
            <nav className="grid grid-cols-2 gap-4 mx-10">
                <h2 className="text-white text-center text-2xl">Most used deck</h2>
                <h2 className="text-white text-center text-2xl">Battle Logs</h2>
            </nav>
        </>
    )
}

export default BattleLog;