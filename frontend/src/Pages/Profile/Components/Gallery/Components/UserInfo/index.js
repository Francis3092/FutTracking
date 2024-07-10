import { FaPlay, FaPause, FaHeart, FaComment, FaEye, FaShareAlt} from "react-icons/fa";
import './index.css';

const UserInfo = ({ video }) => (
    <div className="info-player">
        <div className="info-user">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s" alt="Player Profile" className="img-user-profile" />
            <div className="details-user">
                <p className="username">Ruben Botta</p>
                <p className="location-user">CABA, Buenos Aires, Argentina</p>
            </div>
            <button className="button-follow">Siguiendo</button>
        </div>
        <div className="estats">
            <div className="estat">
                <FaHeart className='estat-icon' />
                <span>{video.likes || 0}</span>
            </div>
            <div className="estat">
                <FaComment className='estat-icon' />
                <span>{video.comments || 0}</span>
            </div>
            <div className="estat">
                <FaEye className='estat-icon' />
                <span>61.3K</span>
            </div>
            <div className="estat">
                <FaShareAlt className='estat-icon' />
                <span>Compartir</span>
            </div>

            
        </div>
    </div>
);

export default UserInfo;