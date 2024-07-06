import dash 
import plotly.express as px


#import dash_html_components as html
from dash import html, dcc, callback, Input, Output
import plotly.express as px     # pip install plotly==5.2.2

import pandas as pd

import requests
import io
import sqlalchemy as db
from . import config as cf


dash.register_page(__name__, path='/social')

#url = "https://files.sustainabilitymonitor.org/csv-data/Final_indicators.csv"
#s = requests.get(url).content
#df1 = pd.read_csv(io.StringIO(s.decode('utf-8')))

#DATABASE_URL='postgresql://postgres:password@localhost:5432/dashboard'
#engine = db.create_engine(DATABASE_URL)

df1 = pd.read_sql_table(
    'final_indicator',
    con=cf.engine
)


df1.rename(columns={'name': 'Firm Name','energy_cons': 'Energy Consumption(GJ)','employees': 'Total Number of Employees','waste': 'Waste Produced(XXX)',
                    'waste_recycled': 'Waste Recycled',
                   'water_cons': 'Water Consumption(cubic meter)','waste_water':'Water Wastage(M^3)','renewable_energy_pct':
                   'Renewable Energy','fuel_fleet':'Fuel Fleet(PJ)','contrib_political':'Political Contribution(in €)',
                   'waste_recycled_pct':'Waste Recycled Percentage',' legal_spending':
                   'Legal Spending(in €)','fines_spending':'Fine Spending(in €)','employee_turnover':'Employee Turnover(%)',
                   'female_pct' :'Total Share of Female Employees','female_mgmt_pct':'Share of Female Employees in Management',
                   'employee_parental_pct':'Employee Parental Percentage','employee_tenure':'Employee Tenure',
                   'employee_under30_pct':'Share of Employees Under 30 Years Old',
                   'employee_over50_pct':'Share of Employees Over 50 Years Old',
                   'training_spending':'Training spending(in €)'}, inplace=True)


df1 = df1.sort_values(by=["year"], ascending= False)


df_small = df1[df1["Total Number of Employees"] < 15000];
df_small1 = df_small[df_small["Total Number of Employees"] >= 1];

df_medium = df1[df1["Total Number of Employees"] < 50000];
df_medium1 = df_medium[df_medium["Total Number of Employees"] >= 15000];

df_large = df1[df1["Total Number of Employees"] < 350000];
df_large1 = df_large[df_large["Total Number of Employees"] >= 50000];

df_larger = df1[df1["Total Number of Employees"] >= 350000];

all_firm_options = {
    'all': df1["Firm Name"].unique(),
    'small': df_small1["Firm Name"].unique(),
    'medium': df_medium1["Firm Name"].unique(),
    'large': df_large1["Firm Name"].unique(),
    'larger': df_larger["Firm Name"].unique()
}


layout = html.Div([
    html.H1("Firm Social Analysis", style={"textAlign": "center"}),
    html.Hr(),
    
    html.Div([
    html.Div('In this dashboard, you can visualize social indicators for selected firms.',
             style={'color': 'black', 'fontSize': 18}),
        html.Div('Use the dropdown menus to select the year, firm size, and firms you would like to visualize.',
             style={'color': 'black', 'fontSize': 18}),
    ], style={'marginBottom': 50, 'marginTop': 25,'marginLeft': 15}),
    
    html.P("Choose Year:"),
    html.Div(html.Div([
        dcc.Dropdown(id='year-value', clearable=True,
                     options=[{'label': x, 'value': x} for x in
                              df1["year"].unique()]),
    ],className="two columns"),className="row"),
    
    html.P("Select Firm Size"),
    html.Div(html.Div([
        dcc.Dropdown(id='indus_size', clearable=False,
                     value='all',
                     options=[
                        {'label':'All sizes','value':'all'},
                        {'label':'<15k employees','value':'small'},
                        {'label':'15k-50k employees','value':'medium'},
                        {'label':'50k-350k employees','value':'large'},
                        {'label':'>350k employees','value':'larger'}
                        ]),
    ], className="three columns"), className="row"),

    html.P("Select One or More Firms"),
    html.Div(html.Div([
        dcc.Dropdown(id='firm_name', clearable=False,
                    multi=True, style={'width': '100%'}),
    ],className="four columns"),className="row"),
    
    html.Div(id="output-div-social", children=[]), 
    
])

@callback(
    Output(component_id="firm_name", component_property="options"),         
    Input(component_id="indus_size", component_property="value")
)
def set_firm_list_options(indus_size_chosen):
    return [{'label': x, 'value': x} for x in all_firm_options[indus_size_chosen]]



@callback(Output(component_id="output-div-social", component_property="children"),
              Input(component_id="indus_size", component_property="value"),
              Input(component_id="year-value", component_property="value"),
              Input(component_id="firm_name", component_property="value")
)


def make_graphs(indus_size, selected_year, selected_firms):
    
    if selected_year and selected_firms:
        
        #graph1
        df_year = df1[df1["year"]==selected_year]
        df_year2 =  df_year[df_year["Firm Name"].isin(selected_firms)]

        
        print(df_year2)
        
        # Bar chart 1
        
        bar_chart1 = px.bar(df_year2, x =selected_firms , y ='Total Number of Employees')
        bar_chart1.update_layout(
                                title = "Total Employees by Firm",
                                title_x = 0.25,
                                xaxis_title="Firm Name",
                                font=dict(
                                family="Arial",
                                size=15,
                                color="RebeccaPurple",
                                )
        
        )
        bar_chart1.update_yaxes(rangemode="tozero")
        

        # Bar chart 2
        
        bar_chart2 = px.bar(df_year2, x =selected_firms, y ='Total Share of Female Employees'
                            
                            )
        
        bar_chart2.update_layout(
                                title = "Female Employees (percentage)",
                                title_x = 0.25,
                                xaxis_title="Firm Name",
                                font=dict(
                                family="Arial",
                                size=15,
                                color="RebeccaPurple",
                                )
        
        )
        bar_chart2.update_yaxes(rangemode="tozero")


        # Bar chart 3
        
        bar_chart3 = px.bar(df_year2, x = selected_firms, y ='Share of Female Employees in Management'
                        
                            )
        
        bar_chart3.update_layout(
                                title = 'Female Employees in Management (percentage)',
                                title_x = 0.25,
                                xaxis_title="Firm Name",
                                font=dict(
                                family="Arial",
                                size=15,
                                color="RebeccaPurple",
                                )
        
        )
        bar_chart3.update_yaxes(rangemode="tozero")
        
        # Bar chart 4
        
        bar_chart4 = px.bar(df_year2, x =selected_firms, y ='Share of Employees Under 30 Years Old'
                            
                            )
        
        bar_chart4.update_layout(
                                title = "Employees Under 30 Years Old (percentage)",
                                title_x = 0.25,
                                xaxis_title="Firm Name",
                                font=dict(
                                family="Arial",
                                size=15,
                                color="RebeccaPurple",
                                )
        
        )
        bar_chart4.update_yaxes(rangemode="tozero")

        # Bar chart 5
        
        bar_chart5 = px.bar(df_year2, x =selected_firms, y ='Share of Employees Over 50 Years Old'
                            
                            )
        
        
        
        
        bar_chart5.update_layout(
                                title = "Employees Over 50 Years Old (percentage)",
                                title_x = 0.25,
                                xaxis_title="Firm Name",
                                font=dict(
                                family="Arial",
                                size=15,
                                color="RebeccaPurple",
                                )
        
        )
        bar_chart5.update_yaxes(rangemode="tozero")
        
        return [
            
            
            html.Div([
                html.Div([dcc.Graph(figure=bar_chart1)], className="six columns"),
                html.Div([dcc.Graph(figure=bar_chart2)], className="six columns"),
            ], className="row"),
            
            
            html.Div([
                html.Div([dcc.Graph(figure=bar_chart3)], className="six columns"),
                html.Div([dcc.Graph(figure=bar_chart4)], className="six columns"),
            ], className="row"),
            
            
            html.Div([
                html.Div([dcc.Graph(figure=bar_chart5)], className="six columns"),
            ], className="row")    
        ]
        