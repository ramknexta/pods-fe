const Admin = ({children, customClassName = ""}) => {
    return (
        <div className='relative w-full h-[100vh]'>
            <div className={`${customClassName} fixed bottom-5 right-5 h-4/5 w-11/12 border border-mild-black rounded-lg bg-white`}>
                {children}
            </div>
        </div>
    )
}

export default Admin