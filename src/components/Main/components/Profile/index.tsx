import formatNumber from './utils'
import { UserType } from './types'

export default function Profile({ userData }: { userData: UserType }) {

  return (
    <section className='w-full border-b-[1px] border-[#d0d7de] py-8 md:max-w-[256px] lg:max-w-[296px] md:border-b-0'>
      <div className='flex items-center mb-4 md:flex-col md:items-start md:mb-0'>
        <img src={userData.avatarUrl} alt={`${userData.login}'s avatar`} className='w-1/6 border-2 border-[#D0D7DE]  rounded-full mr-4 md:w-full' />
        <div className='py-4'>
          <h1 className='text-2xl text-[#1f2328] font-bold'>{userData.name}</h1>
          <h2 className='text-xl text-[#656d76] font-light'>{userData.login}</h2>
        </div>
      </div>
      <button className='w-full bg-[#f6f8fa] text-[#24282f] font-medium px-4 py-[5px] rounded-md text-sm border-[1px] border-[#d0d7de] shadow mb-4 hidden md:block'>Follow</button>
      <p className='text-[#1f2328] mb-4'>{userData.bio}</p>
      <div className='text-sm mb-4'>
        <i className='fa-solid fa-users text-[#656d76] mr-2' />
        <span className='text-[1f2328] font-semibold'>{formatNumber(userData.followers.totalCount)}</span>
        <span className='text-[#656d76]'> followers</span> ·
        <span className='text-[1f2328] font-semibold'> {formatNumber(userData.following.totalCount)}</span>
        <span className='text-[#656d76]'> following</span>
      </div>
      <button className='w-full bg-[#f6f8fa] text-[#24282f] font-medium px-4 py-[5px] rounded-md text-sm border-[1px] border-[#d0d7de] shadow md:hidden'>Follow</button>
    </section>
  )
}
