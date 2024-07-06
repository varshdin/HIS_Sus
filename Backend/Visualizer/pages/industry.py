# import pandas as pd
import dash
import plotly.express as px


#import dash_html_components as html
from dash import html, dcc, callback, Input, Output
import plotly.express as px     # pip install plotly==5.2.2

import pandas as pd
import sqlalchemy as db

import requests
import io
from . import config as cf

dash.register_page(__name__, path='/industry')
#DATABASE_URL='postgresql://postgres:password@localhost:5432/dashboard'
#engine = db.create_engine(DATABASE_URL)

df1 = pd.read_sql_table(
    'indicator',
    con=cf.engine
)
#url = "https://files.sustainabilitymonitor.org/csv-data/Group2Data.csv"
#s = requests.get(url).content
#df1 = pd.read_csv(io.StringIO(s.decode('utf-8')))

df1.rename(columns={'scope_3': 'Scope 3(Emissions in Tons)','scope_2': 'Scope 2(Emissions in Tons)','scope_1':
                    'Scope 1(Emissions in Tons)','year': 'Years','energy_cons': 'Energy Consumption(GJ)','employees':
                    'Total Number of Employees','waste': 'Waste',
                    'waste_recycled': 'Waste Recycled',
                   'water_cons': 'Water Consumption(cubic meter)','waste_water':'Water Wastage(M^3)','renewable_energy_pct':
                   'Renewable Energy','fuel_fleet':'Fuel Fleet(PJ)','contrib_political':'Political Contribution(in €)',
                   'waste_recycled_pct':'Waste Recycled Percentage',' legal_spending':
                   'Legal Spending(in €)','fines_spending':'Fine Spending(in €)','employee_turnover':'Employee Turnover',
                   'female_pct' :'Total Share of Female Employees','female_mgmt_pct':'Share of Female Employees in Management',
                   'employee_parental_pct':'Employee Parental Percentage','employee_tenure':'Employee Tenure',
                   'employee_under30_pct':'Share of Employees Under 30 Years Old',
                   'employee_over50_pct':'Share of Employees Over 50 Years Old',
                   'training_spending':'Training spending(in €)'}, inplace=True)


indicators = ['Total Number of Employees', 'Employee Turnover', 'Total Share of Female Employees',
              'Share of Female Employees in Management',
              'Share of Employees Under 30 Years Old', 'Share of Employees Over 50 Years Old',
              'Water Consumption(cubic meter)', 'Waste', 'Scope 1(Emissions in Tons)', 'Scope 2(Emissions in Tons)',
              'Scope 3(Emissions in Tons)']


layout = html.Div([
    html.H1("Industry Indicators Analysis",
            style={"textAlign": "center"}),
    html.Hr(),
    html.Div([
        html.Div('In this dashboard, you can visualize ESG indicators for selected industries.',
             style={'color': 'black', 'fontSize': 18}),
        html.Div('Use the dropdown menus to select the industries, firm size and indicator you would like to visualize.',
                 style={'color': 'black', 'fontSize': 18}),
        html.Div('Use the radio buttons to select the value type of indicator for the visualization.',
             style={'color': 'black', 'fontSize': 18}),
        html.Div('On the right-hand side of the graphs, click on the industry (firm) names to hide or unhide industries (firms) from the analysis and compare the results.',
                 style={'color': 'black', 'fontSize': 18}),
    ], style={'marginBottom': 50, 'marginTop': 25, 'marginLeft': 15}),

    html.H3("Analysis per Industry and Firms", style={"textAlign": "center"}),
    html.P("Select Industry"),
    html.Div(html.Div([
        dcc.Dropdown(id='indus_list', clearable=False,
                     value="Health care",
                     options=[{'label': x, 'value': x} for x in
                              df1["industry"].unique()]
                     )
    ], className="three columns"), className="row"),

    html.P("Select Firm Size"),
    html.Div(html.Div([
        dcc.Dropdown(id='indus_size', clearable=False,
                     value="all",
                     options=[
                        {'label':'All sizes','value':'all'},
                        {'label':'<15k employees','value':'small'},
                        {'label':'15k-50k employees','value':'medium'},
                        {'label':'50k-350k employees','value':'large'},
                        {'label':'>350k employees','value':'larger'}
                        ]),
    ], className="three columns"), className="row"),

    html.P("Select Indicator"),
    html.Div(html.Div([
        dcc.Dropdown(id='indi_list', clearable=False,
                     options=[{'label': x, 'value': x} for x in
                              indicators]),
    ], className="three columns"), className="row"),

    html.P("Select Value Type of Indicator for Visualization"),
    html.Div(html.Div([
        dcc.RadioItems(
                ['Original Value', 'Average Value per Employee'],
                'Original Value',
                id='compared_value',
                inline=True
            )
    ], className="three columns"), className="row"),

    html.Div(id="output-div-industry", children=[]),


    html.H3("Averages per Industry", style={"textAlign": "center"}),
    html.P("Select One or More Industries"),
    html.Div(html.Div([
        dcc.Dropdown(id='indus_list2', clearable=False,
                     options=[{'label': x, 'value': x} for x in
                              df1["industry"].unique()], multi=True),
    ], className="three columns"), className="row"),
    html.P("Select Indicator"),
    html.Div(html.Div([
        dcc.Dropdown(id='indi_list2', clearable=False,
                     options=[{'label': x, 'value': x} for x in
                              indicators]),
    ], className="three columns"), className="row"),
    html.Div(id="output-div-industry2", children=[])

])


@callback(Output(component_id="output-div-industry", component_property="children"),

              Input(component_id="indus_list", component_property="value"),
              Input(component_id="indi_list", component_property="value"),
              Input(component_id="indus_size", component_property="value"),
              Input(component_id="compared_value", component_property="value")
              )

def make_graphs(indus_list, ind_chosen, indus_size, compared_value):
    min_employees=0; max_employees=0
    if indus_size == "all": min_employees = 0; max_employees = 0
    elif indus_size == "small": min_employees = 1;  max_employees = 15000
    elif indus_size == "medium": min_employees = 15000; max_employees = 50000
    elif indus_size == "large": min_employees = 50000; max_employees = 350000
    elif indus_size == "larger": min_employees = 350000; max_employees = 3500000
    if indus_list and ind_chosen:
        #graph1
        if min_employees == 0 and max_employees == 0:
            df_ind = df1[df1["industry"] == indus_list]
        else: 
            df_ind2 = df1[df1["industry"] == indus_list];
            df_ind1 = df_ind2[df_ind2["Total Number of Employees"] < max_employees];
            df_ind = df_ind1[df_ind1["Total Number of Employees"] >= min_employees]
        # LINE CHART
        df_ind=df_ind.dropna(subset=ind_chosen)
        if len(df_ind[ind_chosen])>0:
            if compared_value == "Original Value":
                df_line = df_ind.sort_values(by=[ind_chosen], ascending=True)
                df_line = df_line.groupby(
                    ["Years", "name", ind_chosen]).size().reset_index(name="count")
                fig = px.line(df_line, x="Years", y=ind_chosen, color='name', markers=True)
                fig.update_xaxes(nticks=4)
            elif compared_value == "Average Value per Employee":
                df_ind["value_per_employee"]=df_ind[ind_chosen]/df_ind["Total Number of Employees"]
    
                df_line = df_ind.sort_values(by=['value_per_employee'], ascending=True)
                df_line = df_line.groupby(
                    ["Years", "name", "value_per_employee"]).size().reset_index(name="count")
            
                fig = px.line(df_line, x="Years", y="value_per_employee", color='name', markers=True,
                                labels={"value_per_employee": ind_chosen + " per Employee"})
                fig.update_xaxes(nticks=4)

            return [

                html.Div([
                    html.Div([dcc.Graph(figure=fig)]),
                ], className="row"),

            ]
        else:
            return [
                    
                html.H2("Sorry, currently we do not have data for the selected firm-indicator combination.", style={"textAlign":"center"})
                ]



@callback(Output(component_id="output-div-industry2", component_property="children"),

              Input(component_id="indus_list2", component_property="value"),
              Input(component_id="indi_list2", component_property="value")
              )
def avg_graph(indus_list2, ind_chosen2):
    if indus_list2 and ind_chosen2:

        df_ind1 = df1[df1["industry"].isin(indus_list2)]

        # LINE CHART
        meandf = df_ind1.groupby(['industry', 'Years']).mean().reset_index()
        
        fig2 = px.line(meandf, x="Years", y=ind_chosen2,
                    color='industry', markers=True,
                    labels={ind_chosen2: "Average "+ind_chosen2})
        fig2.update_xaxes(nticks=4)
        meandf1 = df1.groupby(['industry']).mean().reset_index()
        fig2_1 = px.bar(meandf1, x="industry", y=ind_chosen2,
                        color="industry",
                        labels={ind_chosen2: "Average "+ind_chosen2})

        return [

            html.Div([
                html.Div([dcc.Graph(figure=fig2)]),
            ], className="row"),
            html.Div([
                html.Div([dcc.Graph(figure=fig2_1)]),
            ], className="row"),

        ]
