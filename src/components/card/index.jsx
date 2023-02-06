import './index.css'

function Card(props) {

    return (

            <div className="card">
                <div>
                <div className='img-div'><img className="image" src={props.img_url}/></div>
                <div className="id"> N°{props.id} </div>
                <div className="name">{props.name}</div>
                <div className="types">{props.type}</div>
                <div className='view' onClick={props.function}>view</div>
                </div>
            </div>

    )
}

export default Card