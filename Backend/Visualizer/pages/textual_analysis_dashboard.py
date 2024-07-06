#!/usr/bin/env python
# coding: utf-8

# In[1]:
import dash                # pip install dash
from dash.dependencies import Input, Output, State
from dash import dcc,html
import psycopg2
import pandas as pd
import ast
from pages.db import DATABASE_URL_TEXTUAL_DASHBOARD
import plotly.express as px
# pip install plotly==5.2.2

try:
    #Connection to DB for fetching data related to Text Analysis
    conn=psycopg2.connect(DATABASE_URL_TEXTUAL_DASHBOARD)

    #Fetch data for Bigrams and Wordcloud
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM \"Wordcloud_and_Bigrams_data\"")
    result=cursor.fetchall()
    df_bigrams=pd.DataFrame(result,columns=["number","company_name","year","wordcloud","bigrams"])


except Exception as e:
    print(f"Error: {e}")
    while True:
        conn=psycopg2.connect(DATABASE_URL_TEXTUAL_DASHBOARD)
        cursor.execute("SELECT * FROM \"Wordcloud_and_Bigrams_data\"")
        result=cursor.fetchall()
        df_bigrams=pd.DataFrame(result,columns=["number","company_name","year","wordcloud","bigrams"])
        break

#df_bigrams=df_bigrams[1:]

#fetches data to display on UI as dropdown and helps to map to current tablenames for companies
display_df=pd.read_excel("https://s3.eu-central-1.amazonaws.com/files.sustainabilitymonitor.org/AliasNamesMappingDB/names_mapping.xlsx")


#Code for Bigrams ,This code reads data fetched from db which is stored as string of dictionaries
# and converts it into a dataframe with appropriate structure
newdf = pd.DataFrame(columns=['company_name','year','Bigram','word_freq'])
for index, row in df_bigrams.iterrows():
 
    wordictstring=row['bigrams']
    worddict = ast.literal_eval(wordictstring)
    for  tuple in worddict:
        bigram=""
        cnt=0
        for word in tuple:
            bigram=bigram+word
            cnt=cnt+1;
            if(cnt==1):
                bigram=bigram+" ";
       
        #new_row = {'company_name':row['company_name'], 'year':int(row['year']), 'Bigram':bigram, 'word_freq':worddict[tuple]}
        #newdf = newdf.append(new_row, ignore_index=True)
        new_row = pd.DataFrame([[row['company_name'],int(row['year']),bigram,worddict[tuple]]],columns=['company_name','year','Bigram','word_freq'])
        newdf=pd.concat([newdf,new_row])
        
newdf = newdf.sort_values(by=["year"], ascending= False)
df_bg=newdf 


#Code for wordcloud
import nltk
nltk.download("stopwords")
from nltk.corpus import stopwords
import wordcloud
import base64
from io import BytesIO


def create_word_cloud(worddict, maximum_words = 100, bg = 'white',
                     maximum_font_size = 128, width = 450, height = 380,
                     random_state = 42, fig_w = 15, fig_h = 10):
    
    # Convert keywords to dictionary with values and its occurences
    stop_words = stopwords.words('english')
    mywordcloud = wordcloud.WordCloud(background_color=bg, max_words=maximum_words, colormap='winter', 
                          stopwords=stop_words, max_font_size=maximum_font_size, 
                          random_state=random_state, 
                          width=width, height=height).generate_from_frequencies(worddict)
   
    return mywordcloud.to_image()



#Function to check if any passed object is empty,returns true if empty  
def IsStringNaN(str):
  return str != str  

from dash import html, dcc, callback, Input, Output
#external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
#app = dash.Dash(__name__ ,external_stylesheets=external_stylesheets)
dash.register_page(__name__, path='/textual')
"""app = dash.Dash(external_stylesheets=[dbc.themes.BOOTSTRAP],
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1"}
    ],
)"""

#dash.register_page(__name__, path='/text')
layout = html.Div([
    html.H1("Firm Textual Analysis", style={"textAlign":"center"}),
    html.Hr(),
    
    html.Div([
    html.Div('In this dashboard, you can visualize the textual analysis of sustainability reports and view information such as the distribution of topics, sentiment analysis, most frequent bigrams (sequences of two words) and the wordcloud for selected firms.',
             style={'color': 'black', 'fontSize': 18}),
        html.Div('Use the dropdown menus to select the year and firm you would like to visualize.',
             style={'color': 'black', 'fontSize': 18}),
    ], style={'marginBottom': 50, 'marginTop': 25,'marginLeft': 15}),
    
    html.P("Choose Year:"),
    html.Div(html.Div([
        dcc.Dropdown(id='year', clearable=True,
                     value="",
                     options=[{'label': x, 'value': x} for x in
                              df_bg["year"].unique()]),
    ],className="two columns"),className="row"),
    
    html.P("Select Firms"),
    html.Div(html.Div([
        dcc.Dropdown(id='company_name', clearable=False,
                     value="",
                     options=[{'label': x, 'value': x} for x in
                              display_df["company_display_name"].unique()],style={'width': '100%'}),
    ],className="three columns"),className="row"),
    
    html.Div(id="output-div", children=[]),  
])

@callback(Output(component_id="output-div", component_property="children"),
              
              Input(component_id="year", component_property="value"),
              Input(component_id="company_name", component_property="value"),
              #Input(component_id="indi_list", component_property="value")               
)


def make_graphs(selected_year, selected_firms): 
#The below if is written to ensure that the below code runs only when there is some selection on front end side
        if selected_firms in display_df["company_display_name"].unique():
            #mapping the selection to actual name of table in db
            company_db_name_df=display_df[display_df["company_display_name"]==selected_firms]
            company_db_name=company_db_name_df["company_db_name"].iloc[0]
            conn=psycopg2.connect(DATABASE_URL_TEXTUAL_DASHBOARD)
            cursor = conn.cursor()
            
            #To ensure that we fire a select query only if we have some table name and not empty word
            if not IsStringNaN(company_db_name):

                #cursor.execute("SELECT * FROM "+company_name+"where score >100")
                cursor.execute("SELECT * FROM \""+company_db_name+"\"")
                result=cursor.fetchall()
                cursor.close()
            else:
                result=[]
 
            df_sc=pd.DataFrame(result)

            if len(df_sc)>0:
                sentimentAndBertDataAvailable=True

                df_sc[1] = df_sc[1].str.replace('_',' ')
            
                bert_categories=pd.DataFrame(df_sc[1].value_counts(normalize=True))
                sentiment_categories=df_sc[5].value_counts(normalize=True)
                sentiment_categories_df=pd.DataFrame({'Sentiment':sentiment_categories.index, 'Proportion':sentiment_categories.values})
                bert_categories = bert_categories.reset_index()
                bert_categories.columns = ['Category', 'Proportion']
                #bert_categories["Category"]=bert_categories.index
                #bert_categories["Proportion"]=bert_categories[1]
                bert_categories["Proportion"]=bert_categories["Proportion"]*100
                mask=bert_categories["Proportion"]<3
                bert_categories["Category"][mask]="Others"


                colors1 = px.colors.diverging.delta[::-1]

                #pie chart for proportion of ESG Bert categories
                pie1=px.pie(bert_categories, values="Proportion", names="Category",title=f"Distribution of Topics for {selected_firms} in {selected_year} ",
                            color_discrete_sequence= colors1)
                # px.colors.qualitative.D3
                pie1.update_layout(autosize=True, font=dict(family="Arial", size=10, color="RebeccaPurple",), title_font=dict(size=18, color='RebeccaPurple', family="Arial"))
                #pie chart for sentiment analysis
                color3 = px.colors.diverging.delta[9]
                color4 = px.colors.diverging.delta[3]
                pie2=px.pie(sentiment_categories_df, values="Proportion", names="Sentiment",color="Sentiment",title=f"Sentiment Analysis for {selected_firms} in {selected_year} ",
                color_discrete_map={'POSITIVE':color3, 'NEGATIVE': color4})
                pie2.update_layout(autosize=True, font=dict(family="Arial", size=10, color="RebeccaPurple",), title_font=dict(size=18, color='RebeccaPurple', family="Arial"))
               
            else:
                sentimentAndBertDataAvailable=False

                  #bigrams graph
            df_bigrams_filtered = df_bg[df_bg["year"]==selected_year]
            
            company_textual_name_df=display_df[display_df["company_display_name"]==selected_firms]
            company_textual_name=company_textual_name_df["company_textual_name"].iloc[0]
            df_bigrams_filtered=df_bigrams_filtered[df_bigrams_filtered["company_name"]==company_textual_name]

            if len(df_bigrams_filtered)>0:

                bigramAndWordcloudDataAvailable=True
                df_bigrams_filtered= df_bigrams_filtered.sort_values(by=["word_freq"], ascending= False)
                # Bar chart
                colors2 = px.colors.diverging.delta[10:1:-2]
                bar_chart = px.bar(df_bigrams_filtered, x ="Bigram" , y ="word_freq", color= 'Bigram',
                                color_discrete_sequence= colors2)#color_discrete_sequence=["#1AFF1A","#74B652", "#94C773","#4B0092" ,"#7B52AE"])
                
                bar_chart.update_layout(autosize=True,
                                        title=f"Top 5 Most Frequent Bigrams for {selected_firms} in {selected_year} ",
                                        xaxis_title="Bigram Words",
                                        yaxis_title="Word Frequencies",
                                        # xaxis_visible=False,
                                        font=dict(family="Arial", size=10,
                                        color="RebeccaPurple",), title_font=dict(size=20, color='RebeccaPurple', family="Arial"))

            #Wordcloud Image
                img = BytesIO()
                df_wordcloud=df_bigrams[df_bigrams["company_name"]==selected_firms]
                wordictstring=df_wordcloud['wordcloud'].iloc[0]
                worddict = ast.literal_eval(wordictstring)
                create_word_cloud(worddict).save(img, format='PNG')  
                
            else:
                bigramAndWordcloudDataAvailable=False

        
            if selected_firms not in display_df["company_display_name"].unique():
                return []

            elif sentimentAndBertDataAvailable and not bigramAndWordcloudDataAvailable:

                return [
                    
                    
                html.Div(children=[
                dcc.Graph(id="graph1",figure=pie1, style={'width': '58%', 'height': '100%','display': 'inline-block'}),          
                dcc.Graph(id="graph2",figure=pie2, style={'width': '42%', 'height': '100%','display': 'inline-block'})
                
            ])]

            elif bigramAndWordcloudDataAvailable and not sentimentAndBertDataAvailable:
                return [
                    
                    
                html.Div(children=[
                dcc.Graph(id="graph3",figure=bar_chart, style={'width': '50%', 'height': '100%','display': 'inline-block'}),
                html.Img(src='data:image/png;base64,{}'.format(base64.b64encode(img.getvalue()).decode(),style={'display': 'inline-block', 'marginLeft': 30}))
            ])]

            elif bigramAndWordcloudDataAvailable and sentimentAndBertDataAvailable:
                 return [
                    
                    
                html.Div(children=[
                dcc.Graph(id="graph1",figure=pie1, style={'max-width': '58%', 'height': '100%','display': 'inline-block'}),          
                dcc.Graph(id="graph2",figure=pie2, style={'max-width': '42%', 'height': '100%','display': 'inline-block'}),
                dcc.Graph(id="graph3",figure=bar_chart, style={'max-width': '50%', 'height': '100%','display': 'inline-block'}),
                html.Img(src='data:image/png;base64,{}'.format(base64.b64encode(img.getvalue()).decode(),style={'max-width': '50%', 'height': 'auto', 'marginLeft': 20, 'display':'inline-block'}))
            ])]

            else:
                return [
                    
                    
                html.H2("Sorry, currently we do not have data for the selected firm-year combination.", style={"textAlign":"center"})
                ]
'''    
server = app.server
if __name__ == '__main__':
    app.run_server(debug=False)
    '''

