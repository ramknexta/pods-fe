const Admin = ({children, customClassName = ""}) => {
    return (
        <div className='relative w-full h-[100vh] bg-gray-100'>
            <div className={`${customClassName} fixed bottom-2 right-5 h-6/7 w-12/13 border border-mild-black rounded-lg bg-white`}>
                {children}
            </div>
        </div>
    )
}

export default Admin