const Admin = ({children}) => {
    return (
        <div className='relative w-full h-[100vh]'>
            <div className='fixed bottom-5 right-5 h-4/5 w-11/12 border border-mild-black rounded-lg'>
                {children}
            </div>
        </div>
    )
}

export default Admin