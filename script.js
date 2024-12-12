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
        qualifyingResults.textContent = '';
        raceResults.textContent = '';
    
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
        const qualifyingList = document.createElement('ul');
        qualifying.forEach((result) => {
            const listItem = document.createElement('li');
    
            const position = document.createElement('span');
            position.textContent = result.position;
            listItem.appendChild(position);
    
            const driverName = document.createElement('span');
            driverName.textContent = `${result.driver.forename} ${result.driver.surname}`;
            listItem.appendChild(driverName);
    
            const constructorName = document.createElement('span');
            constructorName.textContent = result.constructor.name;
            listItem.appendChild(constructorName);
    
            const q1 = document.createElement('span');
            q1.textContent = `Q1: ${result.q1 || 'N/A'}`;
            listItem.appendChild(q1);
    
            const q2 = document.createElement('span');
            q2.textContent = `Q2: ${result.q2 || 'N/A'}`;
            listItem.appendChild(q2);
    
            const q3 = document.createElement('span');
            q3.textContent = `Q3: ${result.q3 || 'N/A'}`;
            listItem.appendChild(q3);
    
            qualifyingList.appendChild(listItem);
        });
        qualifyingResults.appendChild(qualifyingList);
    
        const results = await fetchRaceResults(race.id);
        const resultsList = document.createElement('ul');
        results.forEach((result) => {
            const listItem = document.createElement('li');
    
            const position = document.createElement('span');
            position.textContent = result.position;
            listItem.appendChild(position);
    
            const driverName = document.createElement('span');
            driverName.textContent = `${result.driver.forename} ${result.driver.surname}`;
            listItem.appendChild(driverName);
    
            const constructorName = document.createElement('span');
            constructorName.textContent = result.constructor.name;
            listItem.appendChild(constructorName);
    
            const points = document.createElement('span');
            points.textContent = `Points: ${result.points || 'N/A'}`;
            listItem.appendChild(points);
    
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
