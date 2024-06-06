import SearchInput from '../components/SearchInput';

function MyComponent() {
  const handleSearchChange = (value: string) => {
    console.log('Search value:', value);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <SearchInput placeholder="Search..." onChange={handleSearchChange} />
    </div>
  );
}
