import { FaSearch } from 'react-icons/fa'

const SearchInput = () => {
  return (
    <div className='hidden items-center border border-primary/40 justify-center gap-2 px-1 mr-2 rounded-full w-52 lg:flex lg:w-60'>
        <FaSearch  className='opacity-60'/>
        <input aria-label="Search tasks" type="search" className='w-40 bg-transparent py-1 border-0 outline-none lg:w-48' placeholder='Search tasks...' />
    </div>
  )
}

export default SearchInput
