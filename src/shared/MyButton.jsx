const MyButton = (props) => {
    return (
        <button className={`btn btn-${props.variant} ${props.extraClasses}`}>{props.children}</button>
    )
}

export default MyButton