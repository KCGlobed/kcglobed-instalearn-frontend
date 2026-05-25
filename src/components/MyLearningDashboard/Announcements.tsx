import { useParams } from 'react-router-dom';

const Announcements = () => {
    const { slug } = useParams();
    const courseId = Number(slug) || 1;

    return (
        <div>

        </div>
    )
}

export default Announcements
