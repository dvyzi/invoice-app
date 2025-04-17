export default function Buttons({ type, children, onPress }) {
    switch (type) {
        case 'new-invoice':
            return <button onClick={onPress} className="bg-primary text-white px-2 py-2 rounded-3xl items-center gap-2 hover:bg-primary-light text-heading-s hidden md:flex"> <img src="/new.svg" alt="New Invoice" /> {children}</button>;
        case 'new-invoice-mobile':
            return <button className="bg-primary px-[6px] py-[6px] rounded-full text-heading-s flex md:hidden"><img src="/new.svg" alt="New Invoice" /></button>;
        case 'delete':
            return <button className="bg-danger text-white px-3 py-3 rounded-3xl flex items-center hover:bg-danger-light text-heading-s"> {children}</button>;
        case 'primary':
            return <button className="bg-primary text-white px-3 py-3 rounded-3xl flex items-center gap-2 hover:bg-primary-light text-heading-s">{children}</button>;
        case 'secondary':
            return <button className="bg-gray-1 text-dark-gray px-3 py-3 rounded-3xl flex items-center gap-2 hover:bg-gray-light text-heading-s">{children}</button>;
        case 'cancel':
            return <button className="bg-gray-1 text-dark-gray px-3 py-3 rounded-3xl flex items-center gap-2 hover:bg-gray-light text-heading-s">{children}</button>;
        default:
            return <button className="bg-primary text-white px-4 py-2 rounded-md text-heading-s">{children}</button>;
        case 'tertiary':
            return <button className="bg-dark-light text-gray-2 px-3 py-3 rounded-3xl flex items-center gap-2 hover:bg-dark-2 text-heading-s">{children}</button>;
    }
}