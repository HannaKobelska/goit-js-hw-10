import './css/styles.css';
import API from './fetchCountries.js';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    countryList: document.querySelector('.country-list'),
    searchInput: document.querySelector('#search-box'),
    countryInfo: document.querySelector('.country-info'),
  };


refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    event.preventDefault();
    
    const countryToFind = event.target.value.trim();
  
    if (countryToFind.length !== 0) {
         
        API.fetchCountries(countryToFind)
        .then(renderCountryCard)
        .catch(onFetchError);

    }
    else {
        refs.countryList.innerHTML = "";
        refs.countryInfo.innerHTML = "";
    }
}

function renderCountryCard(country) {
    
    if (country.length > 10) {
        Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
    }
    else if ((country.length > 1) && (country.length <= 10)) {
        
        refs.countryList.innerHTML = country.map(({ name, capital, population, flags, languages }) => {
            return `
                <li class="country-list">
                <div class="country-list-div">
                <p class="country"><img src="${flags.svg}" alt="flag" width = 30px height = 15px> ${name.official}</p>
                </div>
                </li>
            `;
        })
            .join('');
    
        refs.countryInfo.innerHTML = "";

    }
    else {
        refs.countryInfo.innerHTML = country.map(({ name, capital, population, flags, languages }) => {
            return `
                <h3><img src="${flags.svg}" alt="flag" width=30px> ${name.official}</h3>
                <p class="info"><b>Capital:</b> ${capital}</p>
                <p class="info"><b>Population:</b> ${population}</p>
                <p class="info"><b>Languages:</b> ${Object.values(languages)}</p>
            `;
        })
            .join('');
        
         refs.countryList.innerHTML = "";
    }
}


function onFetchError(error) {
    Notiflix.Notify.failure(`Oops, there is no country with that name`);
        refs.countryList.innerHTML = "";
        refs.countryInfo.innerHTML = "";
}

