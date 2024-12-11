document.addEventListener('DOMContentLoaded', () => {
    const homeView = document.querySelector('#home-view');
    const racesView = document.querySelector('#races-view');
    const seasonSelect = document.querySelector('#season-select');
    const viewRacesButton = document.querySelector('#view-races');
    const racesList = document.querySelector('#races-list');
    const raceDetails = document.querySelector('#race-details');
    const raceInfo = document.querySelector('#race-info');
    const qualifyingResults = document.querySelector('#qualifying-results');
    const raceResults = document.querySelector('#race-results');
    
    const API_BASE = 'https://www.randyconnolly.com/funwebdev/3rd/api/f1';
    const years = ["2020", "2021", "2022", "2023"];
    
    async function loadSeasons() {
        for (const year of years) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            seasonSelect.appendChild(option);
        }
    }

    async function fetchRaceData(season) {
        const url = `${API_BASE}/races.php?season=${season}`;
        const response = await fetch(url);
        const data = await response.json();
        localStorage.setItem(`season_${season}_races`, JSON.stringify(data));
        return data;
    }
    
    async function fetchQualifyingResults(raceId) {
        const url = `${API_BASE}/qualifying.php?race=${raceId}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    
    async function fetchRaceResults(raceId) {
        const url = `${API_BASE}/results.php?race=${raceId}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    
    async function loadRaces(season) {
        let races;
        if (localStorage.getItem(`season_${season}_races`)) {
            races = JSON.parse(localStorage.getItem(`season_${season}_races`));
        } else {
            races = await fetchRaceData(season);
        }
    
        racesList.textContent = '';
        races.forEach((race) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${race.round}: ${race.name} (${race.circuit.location}, ${race.circuit.country})`;
            listItem.dataset.id = race.id;
            listItem.addEventListener('click', () => displayRaceDetails(race));
            racesList.appendChild(listItem);
        });
    }
    
    async function displayRaceDetails(race) {
        raceInfo.textContent = '';

        const raceName = document.createElement('p');
        raceName.textContent = `Race Name: ${race.name}`;
        raceInfo.appendChild(raceName);

        const raceDate = document.createElement('p');
        raceDate.textContent = `Date: ${race.date}`;
        raceInfo.appendChild(raceDate);

        const raceTime = document.createElement('p');
        raceTime.textContent = `Time: ${race.time}`;
        raceInfo.appendChild(raceTime);

        const circuitLink = document.createElement('a');
        circuitLink.href = race.circuit.url;
        circuitLink.target = '_blank';
        circuitLink.textContent = `Circuit: ${race.circuit.name}`;
        raceInfo.appendChild(circuitLink);

        const location = document.createElement('p');
        location.textContent = `Location: ${race.circuit.location}, ${race.circuit.country}`;
        raceInfo.appendChild(location);

        const qualifying = await fetchQualifyingResults(race.id);
        qualifyingResults.textContent = '';
        const qualifyingTitle = document.createElement('strong');
        qualifyingTitle.textContent = 'Qualifying Results:';
        qualifyingResults.appendChild(qualifyingTitle);

        const qualifyingList = document.createElement('ul');
        qualifying.forEach((result) => {
            const listItem = document.createElement('li');
            const driverName = `${result.driver.forename} ${result.driver.surname}`;
            const constructorName = result.constructor.name;
            const qualifyingTimes = `Q1: ${result.q1 || 'N/A'}, Q2: ${result.q2 || 'N/A'}, Q3: ${result.q3 || 'N/A'}`;
            listItem.textContent = `${result.position}: ${driverName} (${constructorName}) - ${qualifyingTimes}`;
            qualifyingList.appendChild(listItem);
        });
        qualifyingResults.appendChild(qualifyingList);

        const results = await fetchRaceResults(race.id);
        raceResults.textContent = '';
        const resultsTitle = document.createElement('strong');
        resultsTitle.textContent = 'Race Results:';
        raceResults.appendChild(resultsTitle);
    
        const resultsList = document.createElement('ul');
        results.forEach((result) => {
            const listItem = document.createElement('li');
            // Correctly use `driver` and `constructor` based on API response
            const driverName = `${result.driver.forename} ${result.driver.surname}`;
            const constructorName = result.constructor.name;
            const points = result.points || 'N/A';
            listItem.textContent = `${result.position}: ${driverName} (${constructorName}) - Points: ${points}`;
            resultsList.appendChild(listItem);
        });
        raceResults.appendChild(resultsList);


    }
    
    viewRacesButton.addEventListener('click', async () => {
        const season = seasonSelect.value;
    
        if (!season) {
            alert('Please select a season!');
            return;
        }
    
        homeView.classList.add('hidden');
        racesView.classList.remove('hidden');
    
        await loadRaces(season);
    });
    loadSeasons();
});
