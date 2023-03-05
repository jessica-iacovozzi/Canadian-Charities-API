import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Banner from './components/Banner';
import Footer from './components/Footer';
import { MDBTooltip } from 'mdb-react-ui-kit';
import { BsInfoCircle } from 'react-icons/bs';
import { RxPinTop } from 'react-icons/rx';
import SearchBar from './components/SearchBar';

export const API_URL = 'https://canadian-charities.fly.dev/api/v1/charities'

export function Home() {
  const [charities, setCharities] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortingMethod, setSortingMethod] = useState();
  const [attributes, setAttributes] = useState([]);
  const [city, setCity] = useState();
  const [sector, setSector] = useState();

  useEffect(() => {
    const getAttributes = async () => {
      let results = [];

      for (let page = 1; ; page++) {
        const repo = await axios.get(`${API_URL}?page=${page}`);

        results = results.concat(repo.data.data.data);

        if (page > repo.data.meta.total_pages) {
          break;
        }
      }

      setAttributes(results);
    };
    getAttributes();

    const getCharities = async () => {
      const res = await fetch(
        `${API_URL}?sort=name`
      );
      const data = await res.json();
      const pages = data.meta.total_pages;
      setCharities(data.data.data);
      setPageCount(pages);
    };
    getCharities();
  }, []);

  const fetchCharities = async (currentPage, sort='name', city='', sector='') => {
    const res = await fetch(
      `${API_URL}?page=${currentPage + 1}&sort=${sort}&city=${city}&sector=${sector}`
    );
    console.log(`${API_URL}?page=${currentPage + 1}&sort=${sort}&city=${city}&sector=${sector}`)
    const data = await res.json();
    const pages = data.meta.total_pages;
    setPageCount(pages);
    return data.data.data;
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected;
    const charitiesFormServer = await fetchCharities(currentPage, sortingMethod, city, sector);
    setCharities(charitiesFormServer);
    setCurrentPage(currentPage);
    scrollToTop(820)
  };

  const handleCharitySorting = async (data) => {
    setCurrentPage(0);
    let currentPage = 0;
    let sortingMethod = data;
    setSortingMethod(sortingMethod);
    const charitiesFormServer = await fetchCharities(currentPage, sortingMethod, city, sector);
    setCharities(charitiesFormServer);
    scrollToTop(600)
  };

  const handleCityFilter = async (data) => {
    setCurrentPage(0);
    let currentPage = 0;
    let city = data;
    setCity(city);
    const charitiesFormServer = await fetchCharities(currentPage, sortingMethod, city, sector);
    setCharities(charitiesFormServer);
    scrollToTop(600)
  };

  const handleSectorFilter = async (data) => {
    setCurrentPage(0);
    let currentPage = 0;
    let sector = data;
    setSector(sector);
    const charitiesFormServer = await fetchCharities(currentPage, sortingMethod, city, sector);
    setCharities(charitiesFormServer);
    scrollToTop(600)
  };

  const cities = [...new Set(attributes.map((charity) => charity.attributes.city.split(',')[0].trim()))].sort();
  const sectors = [...new Set(attributes.map((charity) => charity.attributes.sector.split('-')[0].trim()))].sort();

  return (
    <div>
      <Banner />
      <div style={{marginBottom: "100px"}} className='red-bg py-3 d-flex justify-content-evenly position-relative'>
      <SearchBar placeholder="Type a charity name" data={attributes} setCharities={setCharities} setPageCount={setPageCount} />
        <div className='row justify-content-center my-4'>
          <div className='col-2'>
            <h4 className='text-center order-title muli'>Filter by city</h4>
            <select style={{width: '240px'}} className='form-select mt-4 mb-2 muli' onChange={(e) => handleCityFilter(e.target.value)}>
              <option value=''>All cities</option>
              {cities.map((city) => {
                return (
                  <option value={city}>{city}</option>
                )
              })}
            </select>
          </div>
        </div>

        <div className='row justify-content-center my-4'>
          <div className='col-2'>
            <h4 className='text-center order-title muli'>Filter by sector</h4>
            <select style={{width: '240px'}} className='form-select mt-4 mb-2 muli' onChange={(e) => handleSectorFilter(e.target.value)}>
              <option value=''>All sectors</option>
              {sectors.map((sector) => {
                return (
                  <option value={sector}>{sector}</option>
                )
              })}
            </select>
          </div>
        </div>

        <div className='row justify-content-center my-4'>
          <div className='col-2'>
            <h4 className='text-center order-title muli'>Sort by</h4>
            <select style={{width: '240px'}} className='form-select mt-4 mb-2 muli' onChange={(e) => handleCharitySorting(e.target.value)}>
              <option value="name">Name</option>
              <option value="city">City</option>
              <option value="sector">Sector</option>
              <option value="rating">Rating</option>
              <option value="grade">Grade</option>
              <option value="demonstrated_impact">Impact</option>
              <option value="cents_to_cause_ratio">Cents to cause</option>
            </select>
          </div>
        </div>
      </div>
      <div className="container-xxl">
        <div className='row mx-5 d-flex justify-content-evenly'>
          {charities.map((charity) => {
            return (
              <div key={charity.id} className='col-6 v my-3'>
                <div className='card shadow w-100 h-100 red-bg'>
                  <div className='card-body p-5 muli d-flex flex-column'>
                    <div>
                      <a href={`//${charity.attributes.website}`} rel="noreferrer" target="_blank" className='text-decoration-none text-info'>
                        <h5 className='card-title text-center h2 font-weight-bold text-white'>{charity.attributes.name}</h5>
                      </a>
                      <h5 className='card-subtile text-center h5 text-white mb-4'>{charity.attributes.slogan}</h5>
                    </div>
                    <div>
                      <p className='card-text'>City: {charity.attributes.city}</p>
                      <p className='card-text'>Sector: {charity.attributes.sector}</p>
                      <div className='d-flex align-items-center'>
                        <MDBTooltip tag='p' placement="bottom" title="Rating is based on financial transparency, need for funding, grade, impact per dollar and cents to cause ratio.">
                          <BsInfoCircle className='svg' />Rating: {charity.attributes.rating}
                        </MDBTooltip>
                      </div>
                      <div className='d-flex align-items-center'>
                        <MDBTooltip tag='p' placement="bottom" title="Grade is based on the charity's public reporting of the work it does and the results it achieves.">
                          <BsInfoCircle className='svg' />Grade: {charity.attributes.grade}
                        </MDBTooltip>
                      </div>
                      <div className='d-flex align-items-center'>
                        <MDBTooltip tag='p' placement="bottom" title="Impact per dollar is calculated from available program information.">
                          <BsInfoCircle className='svg' />Impact per dollar: {charity.attributes.demonstrated_impact}
                        </MDBTooltip>
                      </div>
                      <p className='card-text'>{charity.attributes.cents_to_cause_ratio} of every dollar donated is available for programs, after overhead costs of fundraising and admin/management (excluding surplus).</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className='pagination'>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          forcePage = {currentPage}
          containerClassName={'pagination justify-content-center mt-3'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      </div>
        <RxPinTop onClick={() => {scrollToTop(600)}} style={{fontSize: '30px', color: 'grey', marginLeft: '90%'}}/>
      <Footer />
    </div>
  );
}

export const scrollToTop = (value) => {
  window.scrollTo({
    top: value,
    left: 0,
    behavior: 'smooth'
  })
};
