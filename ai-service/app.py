
from flask import Flask,request,jsonify
app=Flask(__name__)
@app.route('/watermark',methods=['POST'])
def wm():
    return jsonify({'status':'embedded','method':'LSB+DCT'})
@app.route('/analyze',methods=['POST'])
def analyze():
    return jsonify({'risk':'low','recommendation':'increase dct strength'})
app.run(port=8000)
