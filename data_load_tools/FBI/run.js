const fs = require('fs');


const companyCheck = async (path) => {

    let companyJson = fs.readFileSync('json_data/upenn_202204/upenn_202204-220721140302-company-1.json');
    let oldJson = JSON.parse(companyJson);
    const newJson = oldJson.filter(
        (thing, index, self) =>
            index ===
            self.findIndex((t) => t.action === thing.action && t.status === thing.status
                && t.internalId === thing.internalId && t.legalBusinessName === thing.legalBusinessName
                && t.taxIdNo === thing.taxIdNo && t.sourceType === thing.sourceType
                && t.sourceName === thing.sourceName && t.sourceDate === thing.sourceDate
            )
    );

    console.log("companyJson oldJson", oldJson.length)
    console.log("companyJson JSON after filter", newJson.length);

};

const contactCheck = () => {

    let contactJson = fs.readFileSync('json_data/upenn_202204/upenn_202204-220721201947-contact-1-b.json');
    let oldJson = JSON.parse(contactJson);
    const newJson = oldJson.filter(
        (thing, index, self) =>
            index ===
            self.findIndex((t) =>
                t.action === thing.action
                && t.status === thing.status
                && t.sourceType === thing.sourceType
                && t.sourceName === thing.sourceName
                && t.sourceDate === thing.sourceDate
                && t.internalCompanyId === thing.internalCompanyId
                && t.fullName === thing.fullName
                && t.addressStreet === thing.addressStreet
                && t.addressCountry === thing.addressCountry
                && t.email === thing.email
            )
    );

    console.log("contactJson oldJson", oldJson.length)
    console.log("contactJson JSON after filter", newJson.length);

}

const dataPointCheck = () => {

    let dataPointJson = fs.readFileSync('json_data/upenn_202204/upenn_202204-220721140302-dataPoint-1.json');
    let oldJson = JSON.parse(dataPointJson);
    const newJson = oldJson.filter(
        (thing, index, self) =>
            index ===
            self.findIndex((t) =>
                t.action === thing.action
                && t.timeStamp === thing.timeStamp
                && t.serial === thing.serial
                && t.id === thing.id
                && t.internalCompanyId === thing.internalCompanyId
                && t.sourceType === thing.sourceType
                && t.sourceName === thing.sourceName
                && t.sourceDate === thing.sourceDate
                && t.element === thing.element
                && t.value === thing.value
            )
    );

    console.log("dataPointJson oldJson", oldJson.length)
    console.log("dataPointJson JSON after filter", newJson);

    if (oldJson.length !== newJson.length) {
        fs.writeFile('newJSON.json', newJson, 'utf8');
        fs.writeFileSync('newJSON.json', data);
    }

}

const project1Check = () => {

    let project1Json = fs.readFileSync('json_data/upenn_202204/upenn_202204-220721140302-project-1.json');
    let oldJson = JSON.parse(project1Json);
    console.log(oldJson[0].projectCompany[0].companyId)
    const newJson = oldJson.filter(
        (thing, index, self) =>
            index ===
            self.findIndex((t) =>
                t.action === thing.action
                && t.sourceType === thing.sourceType
                && t.sourceName === thing.sourceName
                && t.sourceDate === thing.sourceDate
                && t.title === thing.title
                && t.contract === thing.contract
                && t.budget === thing.budget
                && t.projectStartDate === thing.projectStartDate
                && t.projectEndDate === thing.projectEndDate
                && t.status === thing.status
                && t.archived === thing.archived
            )
    );

    console.log("project oldJson", oldJson.length)
    console.log("project JSON after filter", newJson.length);

}


const localicationCheck = () => {

    let localicationJson = fs.readFileSync('json_data/chop_2021/chop_2021-220721140422-dataPoint-1.json');
    let oldJson = JSON.parse(localicationJson);
    const newJson = oldJson.filter(
        (thing, index, self) =>
            index ===
            self.findIndex((t) =>
                t.action === thing.action
                && t.timeStamp === thing.timeStamp
                && t.serial === thing.serial
                && t.id === thing.id
                && t.internalCompanyId === thing.internalCompanyId
                && t.sourceType === thing.sourceType
                && t.sourceName === thing.sourceName
                && t.sourceDate === thing.sourceDate
                && t.element === thing.element
                && t.value === thing.value
            )
    );

    console.log("dataPointJson oldJson", oldJson.length)
    console.log("dataPointJson JSON after filter", newJson.length);


}



const checkPostalCodeInLocalisation = () => {
    const fullLocationsArray = [];
    for (let i = 1; i < 37; i++) {  
    let localisationJson = fs.readFileSync(`../json_data/statebids-230224165137-location-${i}.json`);
    let oldJson = JSON.parse(localisationJson);
    fullLocationsArray.push(...oldJson);
    }

    // filter all the locatrions with postal code equal to 00000
    const newJson = fullLocationsArray.filter( location => location.postalCode === "00000");
    console.log("longitude with 00000 ",fullLocationsArray.length);
    console.log("longitude  without 00000",newJson.length);
    console.log("fullLocationsArray");
}
checkPostalCodeInLocalisation();
