import os
import requests
import time
import random
from lxml import etree
import urllib
from urllib.parse import urlparse
import json
from json import JSONDecodeError
from pprint import pprint

DOWNLOAD_DIR = './download'
if not os.path.exists(DOWNLOAD_DIR):
  os.mkdir(DOWNLOAD_DIR)


USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0"


def download(url):
  id = urlparse(url).path.split('/')[-1]
  headers = {
      "User-Agent": USER_AGENT,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
  }
  pic = requests.get(url, headers=headers)
  with open(os.path.join(DOWNLOAD_DIR, f'{id}.jpg'), 'wb') as fp:
    fp.write(pic.content)
  print('downloaded', url)


def getImageUrls(id):
  detail_url = f'https://gateway.cantonfair.org.cn/api/clientMicroSiteAggregator/cms/exhibits/detail?lang=zh&siteId=siteExhibitDetail&id={id}'
  headers = {
      "User-Agent": USER_AGENT,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
  }
  response = requests.get(detail_url, headers=headers)
  cover_list = []

  try:
    result = response.json()
    cover_list = result['cover']
  except JSONDecodeError as e:
    print(e.msg)
  return cover_list


def getExhibitUrls(keyword, page=0, size=15):
  url = "https://gateway.cantonfair.org.cn/Api/ESAPI/product/classify?page=0&size=15"
  request_body = {
      "page": page,
      "size": size,  # 测试最多返回50
      "searchKeys": [
          "productNameCN",
          "productNameEN"],
      "searchValue": keyword
  }
  headers = {
      "User-Agent": USER_AGENT,
      "Accept": "application/json, text/plain, */*"
  }
  r = requests.post(url, json=request_body, headers=headers)
  result = r.json()
  returnObj = result['returnObj']
  page = returnObj['page']
  total_page = returnObj['page']
  productIdList = [x['productId'] for x in returnObj['list']]

  return productIdList


def getIdFromUrl(url):
  id = urlparse(url).path.split('/')[-1]
  return id


def getPageInfo(keyword, page=0, size=50):
  url = 'https://gateway.cantonfair.org.cn/Api/ESAPI/product/classify?page=0&size=15'
  request_body = {
      "page": page,
      "size": size,  # 测试最多返回50
      "isSearch": False,
      "searchKeys": [
          "productNameCN",
          "productNameEN"],
      "searchValue": keyword
  }
  headers = {
      "User-Agent": USER_AGENT,
      "Accept": "application/json, text/plain, */*"
  }
  r = requests.post(url, json=request_body, headers=headers)
  result = r.json()
  returnObj = result['returnObj']
  page = returnObj['page']

  totalCount = page['totalCount']
  pageIndex = page['pageIndex']
  pageSize = page['pageSize']
  totalPage = page['totalPage']

  return totalCount, pageIndex, pageSize, totalPage


if __name__ == "__main__":
  keyword = '魔方'
  totalCount, pageIndex, pageSize, totalPage = getPageInfo(keyword)
  print('totalCount:', totalCount)
  print('totalPage:', totalPage)

  page = 0
  size = 15
  while True:
    print(f'page={page}, size={size}')

    exhibitUrls = getExhibitUrls(keyword, page=page, size=size)
    print('len(exhibitUrls)', len(exhibitUrls))
    for i, exhibitId in enumerate(exhibitUrls):
      print(f'Get page={page} i={i}, id={exhibitId}...')
      cover_list = getImageUrls(exhibitId)
      print(f'Downloading... {len(cover_list)} images')
      for conver_url in cover_list:
        download(conver_url)

    if page * size > totalCount:
      break
    page = page + 1
