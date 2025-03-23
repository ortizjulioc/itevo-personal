export default function OptionalInfo ({
    content,
    message = 'No proporcionado'
}: { content?: string, message?: string }) {
    if (content) return <span>{content}</span>

    return (
        <span className='text-gray-400 dark:text-gray-600 italic min-w-max'>{message}</span>
    )
}
