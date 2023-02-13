import './index.css'
import axios from "axios"
import Card from '../../components/card'
import PokeBall from '../../assets/pokeball.png'
import Arrow from '../../assets/arrow.png'

import React, { useState, useEffect } from "react"

function Home() {


    const [types, setTypes] = useState([])

    useEffect(() => {
        
    }, [])

    const getTypes = () => {
        axios.get('https://pokeapi.co/api/v2/type').then((res) => setTypes(res.data.results))
    }

    const [typeFilter, setTypeFilter] = useState('all')
    const [pokemons, setPokemons] = useState([])

    useEffect(() => {
        getCards()
        getTypes()
    }, [])

    let [nextPoke, setNextPoke] = useState('')
    let [prevPoke, setPrevPoke] = useState('')
    let endpoints = []

    const getCards = () => {
      
        axios.get('https://pokeapi.co/api/v2/pokemon').then((res) => {
        
        res.data.results.forEach((element, index) => {
            endpoints.push(res.data.results[index].url)
        });

        setNextPoke(res.data.next)

        axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => setPokemons(res))

        document.getElementById('prev').style.display = 'none'

        })
    }

    const next = () => {
        
        endpoints = []

        axios.get(nextPoke).then((res) => {
        
        res.data.results.forEach((element, index) => {
            endpoints.push(res.data.results[index].url)
        });

        setNextPoke(res.data.next)
        setPrevPoke(res.data.previous)

        axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => setPokemons(res))

        if (res.data.previous != null) {
            document.getElementById('prev').style.display = 'block'
        }

        window.scrollTo(0, 0);

        if (res.data.next === null) {
            document.getElementById('next').style.display = 'none'
        }

        
        })
 
    }

    const prev = () => {
        

        endpoints = []

        axios.get(prevPoke).then((res) => {
        
        res.data.results.forEach((element, index) => {
            endpoints.push(res.data.results[index].url)
        });

        setNextPoke(res.data.next)
        setPrevPoke(res.data.previous)
        

        axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => setPokemons(res))

        window.scrollTo(0, 0);


        if (res.data.previous === null) {
            document.getElementById('prev').style.display = 'none'
        }

        if (res.data.next != null) {
            document.getElementById('next').style.display = 'block'
        }


        })
    }

    const pokeFilter = (name, url) => {
        setTypeFilter(name)
        endpoints = []

        axios.get(url).then((res) => {

            res.data.pokemon.forEach((element, index) => {
                endpoints.push(res.data.pokemon[index].pokemon.url)
            });

            axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => setPokemons(res))

            document.getElementById('next').style.display = 'none'
            document.getElementById('prev').style.display = 'none'

            document.getElementById('searchName').value = ''

            document.getElementById('results').style.display = 'none'
        })
        
    }

    const viewAll = () => {
        setTypeFilter('all')
        getCards()
        document.getElementById('next').style.display = 'block'
        document.getElementById('searchName').value = ''
        document.getElementById('results').style.display = 'none'
    }


    let searchEndpoints = []

    const handleChange = (name) => {
        searchEndpoints = []
        axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0').then((res) => {
            res.data.results.forEach((element, index) => {
                if(res.data.results[index].name.startsWith(name.toLowerCase())){
                    searchEndpoints.push(res.data.results[index].url)
                }
            });
        })
    }

    const pokemonSearch = (e) => {
        e.preventDefault()

        axios.all(searchEndpoints.map((endpoint) => axios.get(endpoint))).then((res) => setPokemons(res))
        setTypeFilter('')
        document.getElementById('next').style.display = 'none'
        document.getElementById('prev').style.display = 'none'

        document.getElementById('results').style.display = 'block'

        document.getElementById('results').innerText = 'Results for: ' + document.getElementById('searchName').value

        document.getElementById('searchName').value = ''

        
    }


    const openCardView = (name, img_url, number, height, weight, abilities, HP, ATK, DEF, SPD, SpA, SpD, types) => {

        let TOT = HP + ATK + DEF + SPD + SpA + SpD

        let type1 = types[0].type.name

        let type2 = ''
        
        if (types.length === 2) {
            type2 = types[1].type.name
        }

        let ability1 = abilities[0].ability.name

        let ability2 = ''

        if (abilities.length === 2) {
            ability2 = abilities[1].ability.name
        }

        

        document.querySelector('.card-view').style.opacity = '100%'
        document.querySelector('.card-view').style.zIndex = '3'
        document.getElementById('pokename').innerText = name
        document.getElementById('number').innerText = 'N°' + number

        if(img_url != null){
            document.getElementById('img').src = img_url
            document.getElementById('img').style.display = 'block'
        } else {
            document.getElementById('img').style.display = 'none'
        }
        

        document.getElementById('height').innerText = height + 'm'
        document.getElementById('weight').innerText = weight + 'kg'
        document.getElementById('abilitie-1').innerText = ability1
        
        if (ability2 === '') {
            document.getElementById('abilitie-2').style.display = 'none'
        } else {
            document.getElementById('abilitie-2').style.display = 'block'
            document.getElementById('abilitie-2').innerText = ability2
        }

        document.getElementById('HP').innerText = HP
        document.getElementById('ATK').innerText = ATK
        document.getElementById('DEF').innerText = DEF
        document.getElementById('SPD').innerText = SPD
        document.getElementById('SpA').innerText = SpA
        document.getElementById('SpD').innerText = SpD
        document.getElementById('TOT').innerText = TOT

        document.getElementById('type1').innerText = type1

        if (type2 === '') {
            document.getElementById('type2').style.display = 'none'
        } else {

            document.getElementById('type2').style.display = 'block'
            document.getElementById('type2').innerText = type2
        }

    }

    const closeCardView = () => {
        document.querySelector('.card-view').style.opacity = '0'
        document.querySelector('.card-view').style.zIndex = '-1'
    }



    return (
        <div >

            <div className="card-view">



                <div className='pokeCard'>
                    <div className='closeButton-div'>
                        <span className='closeButton' onClick={closeCardView}><img src="https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/caa04f8a65fe734.png" alt="" /></span>
                    </div>

                    <div className='div-1'>
                        <p id='pokename'></p>
                        <p id='number'></p>
                        <img id='img' src="" alt="" />
                    </div>

                    <div className='types'>
                        <p id='type1'>Fire</p>
                        <p id='type2'></p>
                    </div>

                    <div className='div-2'>
                        <div className='hw'>
                            <p>Height</p>
                            <div id='height'></div>
                        </div>
                        <div className='hw'>
                            <p>Weight</p>
                            <div id='weight'></div>
                        </div>
                    </div>

                    <div className='div-3'>
                        <p>Abilities</p>
                        <div>
                            <div id='abilitie-1' className='abilities'></div>
                            <div id='abilitie-2' className='abilities'></div>
                        </div>
                    </div>

                    <div className='div-4'>
                        <p className='stat-p'>Stats</p>
                        <div className='stats'>

                            <div className='stats-div'><p className='stat'>HP</p><p id='HP' className='stat-number'>70</p></div>

                            <div className='stats-div'><p className='stat'>ATK</p><p id='ATK' className='stat-number'>70</p></div>

                            <div className='stats-div'><p className='stat'>DEF</p><p id='DEF' className='stat-number'>70</p></div>

                            <div className='stats-div'><p className='stat'>SPD</p><p id='SPD' className='stat-number'>70</p></div>

                            <div className='stats-div'><p className='stat'>SpD</p><p id='SpD' className='stat-number'>70</p></div>

                            <div className='stats-div'><p className='stat'>SpA</p><p id='SpA' className='stat-number'>70</p></div>

                            <div className='tot'><p className='stat stat-tot'>TOT</p><p id='TOT' className='stat-number stat-number-tot'>70</p></div>


                        </div>
                    </div>

                </div>




            </div>

            <nav>
                <div className='root'>
                    <form onSubmit={pokemonSearch} className="search" action="">
                        <input id='searchName' onChange={(e)=>handleChange(e.target.value)} className='input' name='searchedName' placeholder='Search Your Pokemon' type="text"/>
                        <button className='searchButton' type='submit'>Search</button>
                    </form>
                    <section className="filter">
                        <button onClick={viewAll} className={typeFilter === 'all' ? 'active' : 'button'} key={'all'}>all</button>
                        {types.map((type, index) => (
                            <button onClick={() => pokeFilter(type.name, type.url)} className={typeFilter === type.name ? 'active' : 'button'} key={index}>{type.name}</button>
                        ))}
                    </section>
                </div>
            </nav>
            <div id='results'>
                <h2>Results for: </h2>
            </div>
            <div className='div-cards'>
                <div className="cards">
                    {pokemons.map((pokemon, index) => (
                        <Card
                            img_url={pokemon.data.sprites.front_default}
                            name={pokemon.data.name}
                            id={pokemon.data.id}
                            function={() => openCardView(
                                pokemon.data.name,
                                pokemon.data.sprites.front_default,
                                pokemon.data.id,
                                pokemon.data.height,
                                pokemon.data.weight,
                                pokemon.data.abilities,
                                pokemon.data.stats[0].base_stat,
                                pokemon.data.stats[1].base_stat,
                                pokemon.data.stats[2].base_stat,
                                pokemon.data.stats[5].base_stat,
                                pokemon.data.stats[3].base_stat,
                                pokemon.data.stats[4].base_stat,
                                pokemon.data.types
                            )}
                            key={index} />
                    ))}
                </div>
            </div>
            <div className='np'>
                <button id='prev' onClick={prev}><img src={Arrow} alt="" /></button>
                <button id='next' onClick={next}><img src={Arrow} alt="" /></button>
            </div>
        </div>
    )
}
export default Home
