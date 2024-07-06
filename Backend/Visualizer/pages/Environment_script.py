# import pandas as pd
import dash
import plotly.express as px

import sqlalchemy as db

#import dash_html_components as html
from dash import html, dcc, callback, Input, Output
import plotly.express as px     # pip install plotly==5.2.2

import pandas as pd
import pages.config as cf
import io

dash.register_page(__name__, path='/environment')


#DATABASE_URL='postgresql://postgres:password@localhost:5432/dashboard'
#engine = db.create_engine(DATABASE_URL)

df1 = pd.read_sql_table(
    'final_indicator',
    con=cf.engine
)

#url = "https://files.sustainabilitymonitor.org/csv-data/Final_indicators.csv"
#s = requests.get(url).content
#df1 = pd.read_csv(io.StringIO(s.decode('utf-8')))


df1.rename(columns={'name': 'Firm Name','year': 'Years','scope_3': 'Scope 3 (Emissions in Tons)','scope_2': 'Scope 2 (Emissions in Tons)','scope_1':
                    'Scope 1 (Emissions in Tons)','energy_cons': 'Energy Consumption (GJ)','employees': 'Total Number of Employees','waste':
                    'Waste Produced(XXX)',
                    'waste_recycled': 'Waste Recycled',
                   'water_cons': 'Water Consumption (cubic meter)','waste_water':'Waste Water(M^3)','renewable_energy_pct':
                   'Renewable Energy','fuel_fleet':'Fuel Fleet(PJ)','contrib_political':'Political Contribution(in €)',
                   'waste_recycled_pct':'Waste Recycled Percentage',' legal_spending':
                   'Legal Spending(in €)','fines_spending':'Fine Spending(in €)','employee_turnover':'Employee Turnover(%)',
                   'female_pct' :'Total share of Female Employees','female_mgmt_pct':'Share of Female Employees in Management',
                   'employee_parental_pct':'Employee Parental Percentage','employee_tenure':'Employee Tenure',
                   'employee_under30_pct':'Share of Employees Under 30 Years Old',
                   'employee_over50_pct':'Share of Employees Over 50 Years Old',
                   'training_spending':'Training spending(in €)'}, inplace=True)

df_small = df1[df1["Total Number of Employees"] < 15000];
df_small1 = df_small[df_small["Total Number of Employees"] >= 1];

df_medium = df1[df1["Total Number of Employees"] < 50000];
df_medium1 = df_medium[df_medium["Total Number of Employees"] >= 15000];

df_large = df1[df1["Total Number of Employees"] < 350000];
df_large1 = df_large[df_large["Total Number of Employees"] >= 50000];

df_larger = df1[df1["Total Number of Employees"] >= 350000];

indicators = ['Water Consumption (cubic meter)','Energy Consumption (GJ)']

indicators_scope = ['Scope 1 (Emissions in Tons)','Scope 2 (Emissions in Tons)','Scope 3 (Emissions in Tons)']

all_firm_options = {
    'all': df1["Firm Name"].unique(),
    'small': df_small1["Firm Name"].unique(),
    'medium': df_medium1["Firm Name"].unique(),
    'large': df_large1["Firm Name"].unique(),
    'larger': df_larger["Firm Name"].unique()
}

layout = html.Div([
    html.H1("Firm Environmental Analysis", style={"textAlign": "center"}),
    html.Hr(),
    html.Div([
    html.Div('In this dashboard, you can visualize environmental indicators for selected firms.',
             style={'color': 'black', 'fontSize': 18}),
        html.Div('Use the dropdown menus to select the firm size, firms and indicator you would like to visualize.',
             style={'color': 'black', 'fontSize': 18}),
        html.Div('Use the radio buttons to select the value type of indicator for the visualization.',
             style={'color': 'black', 'fontSize': 18}),
        html.Div('On the right-hand side of the graphs, click on the firm names to hide or unhide firms from the analysis and compare the results.',
             style={'color': 'black', 'fontSize': 18}),
    ], style={'marginBottom': 50, 'marginTop': 25,'marginLeft': 15}),
    html.H3("Analysis of Emissions per Firm", style={"textAlign": "center"}),

    html.P("Select Firm Size"),
    html.Div(html.Div([
        dcc.Dropdown(id='indus_size_environment', clearable=False,
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
        dcc.Dropdown(id='firm_list_environme', clearable=False, multi=True), 
    ], className="three columns"), className="row"),
    
    html.P("Select Indicator"),
    html.Div(html.Div([
        dcc.Dropdown(id='indi_list_environment', clearable=False,
                     options=[{'label': x, 'value': x} for x in
                              indicators_scope]),
    ],className="three columns"),className="row"),

    html.P("Select Value Type of Indicator for Visualization"),
    html.Div(html.Div([
        dcc.RadioItems(
                ['Original Value', 'Average Value per Employee'],
                'Original Value',
                id='compared_value',
                inline=True
            )
    ], className="three columns"), className="row"),
    
    html.Div(id="output-div-environment", children=[]),

    
    html.Hr(),
   
    html.H3("Analysis of Other Environmental Indicators per Firm",
            style={"textAlign": "center"}),

    html.P("Select Firm Size"),
    html.Div(html.Div([
        dcc.Dropdown(id='indus_size_environment1', clearable=False,
                     value="all",
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
        dcc.Dropdown(id='firm_list_environme1', clearable=False, multi=True),        
    ], className="three columns"), className="row"),

    html.P("Select Indicator"),
    html.Div(html.Div([
        dcc.Dropdown(id='indi_list_environment1', clearable=False,
                    #  value="Total Number of Employees",
                     options=[{'label': x, 'value': x} for x in
                              indicators]),
    ],className="three columns"),className="row"),

    html.P("Select Value Type of Indicator for Visualization"),
    html.Div(html.Div([
        dcc.RadioItems(
                ['Original Value', 'Average Value per Employee'],
                'Original Value',
                id='compared_value1',
                inline=True
            )
    ], className="three columns"), className="row"),
    
    html.Div(id="output-div2", children=[])
])


@callback(
    Output(component_id="firm_list_environme", component_property="options"),         
    Input(component_id="indus_size_environment", component_property="value")
)
def set_firm_list_options(indus_size_chosen):
    return [{'label': x, 'value': x} for x in all_firm_options[indus_size_chosen]]


@callback(Output(component_id="output-div-environment", component_property="children"),
              Input(component_id="indus_size_environment", component_property="value"),
              Input(component_id="firm_list_environme", component_property="value"),
              Input(component_id="indi_list_environment", component_property="value"),
              Input(component_id="compared_value", component_property="value")       
)


def make_graphs(indus_size_environment,firm_list_environme,ind_chosen, compared_value):
    
    if firm_list_environme and ind_chosen and compared_value:
        
        #graph1
        df_ind = df1[df1["Firm Name"].isin(firm_list_environme)]
        
        # LINE CHART
        df_ind=df_ind.dropna(subset=ind_chosen)
        if len(df_ind[ind_chosen])>0:
            if compared_value == "Original Value":
                df_line = df_ind.sort_values(by=[ind_chosen], ascending=True)
                df_line = df_line.groupby(["Years","Firm Name", ind_chosen]).size().reset_index(name="count")
                fig = px.line(df_line, x="Years", y=ind_chosen,color='Firm Name',markers=True)
                fig.update_xaxes(nticks=4)
            elif compared_value == "Average Value per Employee":
                df_ind["value_per_employee"]=df_ind[ind_chosen]/df_ind["Total Number of Employees"]
                df_line = df_ind.sort_values(by=["value_per_employee"], ascending=True)
                df_line = df_line.groupby(
                    ["Years","Firm Name", "value_per_employee"]).size().reset_index(name="count")
                
                fig = px.line(df_line, x="Years", y="value_per_employee",color='Firm Name',markers=True, 
                              labels={"value_per_employee": ind_chosen+" per Employee"} )
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

@callback(
    Output(component_id="firm_list_environme1", component_property="options"),         
    Input(component_id="indus_size_environment1", component_property="value")
)
def set_firm_list_options(indus_size_chosen):
    return [{'label': x, 'value': x} for x in all_firm_options[indus_size_chosen]]


@callback(Output(component_id="output-div2", component_property="children"),
              Input(component_id="indus_size_environment1", component_property="value"),
              Input(component_id="firm_list_environme1", component_property="value"),
              Input(component_id="indi_list_environment1", component_property="value"),
              Input(component_id="compared_value1", component_property="value")       
)

def make_graphs(indus_size_environment,firm_list_environme1,ind_chosen1, compared_value1):
    if firm_list_environme1 and ind_chosen1 and compared_value1:
        #graph2
        df_ind = df1[df1["Firm Name"].isin(firm_list_environme1)]
        
        # LINE CHART
        df_ind=df_ind.dropna(subset=ind_chosen1)
        if len(df_ind[ind_chosen1])>0:
            if compared_value1 == "Original Value":
                df_line = df_ind.sort_values(by=[ind_chosen1], ascending=True)
                df_line = df_line.groupby(
                    ["Years","Firm Name", ind_chosen1]).size().reset_index(name="count")
                fig1 = px.line(df_line, x="Years", y=ind_chosen1,color='Firm Name',markers=True)
                fig1.update_xaxes(nticks=4)
            elif compared_value1 == "Average Value per Employee":
                df_ind["value_per_employee"]=df_ind[ind_chosen1]/df_ind["Total Number of Employees"]
                df_line = df_ind.sort_values(by=['value_per_employee'], ascending=True)
                df_line = df_line.groupby(
                    ["Years","Firm Name", "value_per_employee"]).size().reset_index(name="count")
                
                fig1 = px.line(df_line, x="Years", y="value_per_employee",color='Firm Name',markers=True, 
                               labels={"value_per_employee": ind_chosen1+" per Employee"})
                fig1.update_xaxes(nticks=4)
                
            
            return [
                
                html.Div([
                html.Div([dcc.Graph(figure=fig1)]),
                ], className="row"),
                
                ]
        else:
            return [
                       
                html.H2("Sorry, currently we do not have data for the selected firm-indicator combination.", style={"textAlign":"center"})
                ]
    
