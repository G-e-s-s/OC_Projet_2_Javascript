const url = "http://localhost:5678/api/works"
const container = document.getElementById("portfolio")

const getArticles = () => {
    fetch(url)
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        var text = '<div class="gallery">';
        for(product in data) {
            text += `
            <figure>
                <img src="${data[product]["imageUrl"]}" alt="${data[product]["title"]}">
				<figcaption>${data[product]["title"]}</figcaption>
			</figure>`
        }
        text +="</div>"
        container.innerHTML += text;
    });
}
getArticles()

