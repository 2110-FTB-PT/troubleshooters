import Card from '../shared/Card'
import { Link } from 'react-router-dom'
import { SiGithub } from 'react-icons/si'

function AboutPage() {
    return (
        <Card>
            <div className="about">
                <br></br>
                <h2>Thank You For Checking Out The Troubleshooters!</h2>
                <br></br>
                <p>Please take the time to look at our github!</p>
                <a className="gitButton" style={{ display: "table-cell" }} href="https://github.com/2110-FTB-PT/troubleshooters" target="_blank">
                    <SiGithub/>
                </a>
                <h4>CRATEDIGGERS</h4>
                <h6>Version: 1.0.0</h6>
                <h6>©2022</h6>

                <p>
                    <Link to='/' className='aboutHome'>Back to Home</Link>
                </p>
            </div>
        </Card>
    )
}

export default AboutPage