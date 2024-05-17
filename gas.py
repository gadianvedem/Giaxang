import requests
from bs4 import BeautifulSoup

def get_gas_prices():
    url = "https://vnexpress.net/chu-de/gia-xang-dau-3026"
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        tables = soup.find_all('table')

        gas_prices = []

        for table in tables:
            rows = table.find_all('tr')
            for row in rows:
                cells = row.find_all('td')
                if len(cells) == 3:
                    mat_hang = cells[0].text.strip()
                    gia = cells[1].text.strip()
                    so_voi_ky_truoc = cells[2].text.strip()
                    if mat_hang != "Mặt hàng":
                        gas_prices.append(f"{mat_hang}: {gia} đồng. (Tăng {so_voi_ky_truoc} đồng)")

        return gas_prices

    else:
        print("Failed to retrieve data from VnExpress")

def save_to_file(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        for item in data:
            f.write("%s\n" % item)

if __name__ == "__main__":
    gas_prices = get_gas_prices()
    if gas_prices:
        save_to_file(gas_prices, "gas_prices.txt")
        print("Gas prices saved to gas_prices.txt")
    else:
        print("No data to save")
