# Speach Submission App
## Form API

### Installation

* Create Resource Group

* Create Azure Storage Account (general storage, locally redundant)
    * Create container `profiles` with no public
    * Create table `profiles`

* Create Azure Function App (consumption plan, use previously created Azure Storage Account for dashboard data)
* Set Azure Function App configuration
    * Key: `ProfileStorage`
    * Value: connection string for Azure Storage Account created
* Configure CORS
* Configure Facebok Authentication (only)
    * Default action for non authenticated users - redirect to Facebook
    * Scopes: `public_profile` and `email`

* Deploy function app
    * Copy files to Azure Storage Account File Share