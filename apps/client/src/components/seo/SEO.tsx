type Props = {
    title: string,
    description?: string,
}

const DEFAULT_DESCRIPTION = "Odiano - Connect, share, and discover moments with your community.";

const SEO = ({ title, description }: Props) => {
    return (
        <>
            <title>{title + " | odiano"}</title>
            <meta name="description" content={description || DEFAULT_DESCRIPTION} />
            <meta
                name="keywords"
                content="social media, odiano, community, posts, friends"
            />
            <meta
                name="author"
                content="Arya Tjiutanto"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
        </>
    )
}

export default SEO;